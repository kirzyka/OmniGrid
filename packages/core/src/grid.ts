import { EventBus } from "./events";
import { SlotManager } from "./slots";
import { Store } from "./store";
import type {
    DataProcessor,
    GridApi,
    GridEvents,
    GridOptions,
    GridPlugin,
    GridState,
    RowClickEvent,
    RowHoverEvent,
    RowId,
    ScrollPosition,
    SlotMount,
    SlotName,
    ViewportData,
    ViewportState,
} from "./types";
import { Virtualizer } from "./virtualizer";

export class Grid<T> implements GridApi<T> {
    private readonly store: Store<GridState<T>>;
    private readonly events = new EventBus<GridEvents<T>>();
    private readonly virtualizer: Virtualizer<T>;
    private readonly cleanupPlugins = new Set<() => void>();
    private readonly dataProcessors = new Set<DataProcessor<T>>();
    private readonly resolveRowId: NonNullable<GridOptions<T>["getRowId"]>;
    public readonly slots: SlotManager<T>;
    private processedDataCache: T[] | null = null;
    private revision = 0;
    private destroyed = false;

    /**
     * Separate ephemeral scroll position that is NOT stored in the Store.
     *
     * Scroll-only updates (scrollTop/scrollLeft) flow through here and never
     * trigger Store notifications, so React (or any adapter subscribed to the
     * Store) does NOT re-render on every scroll frame. Dimension changes
     * (width / height) still go through the Store and DO trigger re-renders.
     */
    private scrollPosition: ScrollPosition = { scrollTop: 0, scrollLeft: 0 };

    public constructor(options: GridOptions<T>) {
        const state: GridState<T> = {
            data: options.data ?? [],
            columns: options.columns,
            viewport: { width: 0, height: 0, scrollTop: 0, scrollLeft: 0 },
            rowHeight: options.rowHeight ?? 32,
            rowOverscan: options.rowOverscan ?? 5,
            columnOverscan: options.columnOverscan ?? 2,
        };
        this.store = new Store(state);
        this.resolveRowId = options.getRowId ?? ((_row, index) => index);
        this.virtualizer = new Virtualizer({
            rowHeight: state.rowHeight,
            rowOverscan: state.rowOverscan,
            columnOverscan: state.columnOverscan,
        });
        this.slots = new SlotManager<T>({
            onChange: (slot: SlotName, mounts: SlotMount<T>[]) => {
                this.store.setState({});
                this.events.emit("slotsChange", { slot, mounts });
            },
        });
        this.store.subscribe(() => this.events.emit("stateChange", this.store.getState()));
        options.plugins?.forEach((plugin) => this.registerPlugin(plugin));
    }

    public getState(): GridState<T> {
        return this.store.getState();
    }

    /** Returns the current ephemeral scroll position (not part of Store state). */
    public getScrollPosition(): ScrollPosition {
        return this.scrollPosition;
    }

    public getViewportData(): ViewportData<T> {
        const state = this.getState();
        const processedData = this.getProcessedData();
        const visibleColumns = state.columns.filter((column) => !column.hidden);
        const rowRange = this.virtualizer.getRowRange(
            processedData.length,
            this.scrollPosition.scrollTop,
            state.viewport.height,
        );
        const columnRange = this.virtualizer.getColumnRange(
            visibleColumns,
            this.scrollPosition.scrollLeft,
            state.viewport.width,
        );
        const columnOffsets = this.virtualizer.getColumnOffsets(visibleColumns, state.viewport.width);

        return {
            rows: processedData.slice(rowRange.start, rowRange.end).map((data, index) => {
                const rowIndex = rowRange.start + index;
                return { id: this.getRowId(data, rowIndex), data, index: rowIndex, offset: rowIndex * state.rowHeight };
            }),
            columns: visibleColumns.slice(columnRange.start, columnRange.end).map((column, index) => {
                const columnIndex = columnRange.start + index;
                const item = columnOffsets[columnIndex];
                return { column, index: columnIndex, offset: item.offset, width: item.size };
            }),
            rowRange,
            columnRange,
            totalWidth: this.virtualizer.getTotalWidth(visibleColumns, state.viewport.width),
            totalHeight: this.virtualizer.getTotalHeight(processedData.length),
        };
    }

    public getProcessedData(): T[] {
        // Cache is invalidated by setData / setColumns / processor registration.
        // During scroll the pipeline is NOT re-run — critical optimization for
        // DOM Pool operation with large row counts.
        if (this.processedDataCache !== null) return this.processedDataCache;
        const result = [...this.dataProcessors].reduce((data, processor) => processor(data), this.getState().data);
        this.processedDataCache = result;
        return result;
    }

    public getRowId(row: T, index: number): RowId {
        return this.resolveRowId(row, index);
    }

    public setData(data: T[]): void {
        this.assertActive();
        this.processedDataCache = null;
        this.revision += 1;
        this.store.setState({ data });
        this.events.emit("dataChange", data);
    }

    public setViewport(viewport: Partial<ViewportState>): void {
        this.assertActive();
        const state = this.store.getState();
        const current = state.viewport;
        const nextViewport = { ...current, ...viewport };

        // isUnchanged compares against the ephemeral scrollPosition, NOT
        // the Store's stale scrollTop (which scroll-only updates never
        // write to). Comparing against Store.scrollTop would make every
        // return-to-zero a no-op: 0 === 0 → early return → scrollPosition
        // never updated → DomPool renders rows at the old offset → empty grid.
        const isUnchanged =
            nextViewport.width === current.width &&
            nextViewport.height === current.height &&
            nextViewport.scrollTop === this.scrollPosition.scrollTop &&
            nextViewport.scrollLeft === this.scrollPosition.scrollLeft;
        if (isUnchanged) return;

        // Update the ephemeral scroll position ONLY for properties explicitly
        // passed. Dimension-only updates (e.g. scrollbar-detection calling
        // `setViewport({ width })`) must NOT clobber scrollPosition with a
        // stale Store scrollTop — otherwise the DomPool syncs to the wrong
        // position until the next rAF tick, causing blank/half-empty grids
        // on rapid scroll-to-top.
        if (viewport.scrollTop !== undefined) {
            this.scrollPosition.scrollTop = viewport.scrollTop;
        }
        if (viewport.scrollLeft !== undefined) {
            this.scrollPosition.scrollLeft = viewport.scrollLeft;
        }

        // Only notify Store subscribers (e.g. React via useSyncExternalStore)
        // when dimensions change. Scroll-only updates must NOT trigger a
        // Store notification — otherwise every scroll frame re-renders React.
        const hasStructuralChange =
            nextViewport.width !== current.width || nextViewport.height !== current.height;

        if (hasStructuralChange) {
            this.store.setState({ viewport: nextViewport });
        }

        this.events.emit("viewportChange", nextViewport);
    }

    /**
     * Repaints the current viewport: notifies Store subscribers that
     * visible rows and row classes (rowClassRules) may need rebinding
     * in a single batch. Increments revision so adapters can detect
     * structural changes.
     */
    public refresh(): void {
        this.assertActive();
        this.revision += 1;
        this.store.setState({});
    }

    public setColumns(columns: GridState<T>["columns"]): void {
        this.assertActive();
        this.processedDataCache = null;
        this.revision += 1;
        this.store.setState({ columns });
    }

    public registerDataProcessor(processor: DataProcessor<T>): () => void {
        this.assertActive();
        this.dataProcessors.add(processor);
        this.processedDataCache = null;
        const unregister = () => {
            this.dataProcessors.delete(processor);
            this.processedDataCache = null;
        };
        return unregister;
    }

    public headerClick(columnId: string, multiSort = false): void {
        this.assertActive();
        this.events.emit("headerClick", { columnId, multiSort });
    }

    public rowClick(row: RowClickEvent<T>): void {
        this.assertActive();
        this.events.emit("rowClick", row);
    }

    public rowHover(row: RowHoverEvent<T>): void {
        this.assertActive();
        this.events.emit("rowHover", row);
    }

    public subscribe(listener: () => void): () => void {
        if (this.destroyed) return () => undefined;
        return this.store.subscribe(listener);
    }

    public on<EventName extends keyof GridEvents<T>>(
        event: EventName,
        listener: (payload: GridEvents<T>[EventName]) => void,
    ): () => void {
        this.assertActive();
        return this.events.on(event, listener);
    }

    public registerPlugin(plugin: GridPlugin<T>): () => void {
        this.assertActive();
        const cleanup = plugin.register(this);
        const unregister = () => {
            cleanup?.();
            this.cleanupPlugins.delete(unregister);
        };
        this.cleanupPlugins.add(unregister);
        return unregister;
    }

    public getSlotMounts(slot: SlotName): SlotMount<T>[] {
        return this.slots.getMounts(slot);
    }

    /** Monotonic counter for structural changes (refresh / data / columns). */
    public getRevision(): number {
        return this.revision;
    }

    public destroy(): void {
        if (this.destroyed) return;
        this.cleanupPlugins.forEach((cleanup) => cleanup());
        this.cleanupPlugins.clear();
        this.dataProcessors.clear();
        this.processedDataCache = null;
        this.slots.clear();
        this.store.clear();
        this.events.clear();
        this.destroyed = true;
    }

    public isDestroyed(): boolean {
        return this.destroyed;
    }

    private assertActive(): void {
        if (this.destroyed) throw new Error("Grid has been destroyed");
    }
}
