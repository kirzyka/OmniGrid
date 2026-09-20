import { EventBus } from "./events";
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
    private destroyed = false;

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
        this.store.subscribe(() => this.events.emit("stateChange", this.store.getState()));
        options.plugins?.forEach((plugin) => this.registerPlugin(plugin));
    }

    public getState(): GridState<T> {
        return this.store.getState();
    }

    public getViewportData(): ViewportData<T> {
        const state = this.getState();
        const processedData = this.getProcessedData();
        const visibleColumns = state.columns.filter((column) => !column.hidden);
        const rowRange = this.virtualizer.getRowRange(
            processedData.length,
            state.viewport.scrollTop,
            state.viewport.height,
        );
        const columnRange = this.virtualizer.getColumnRange(
            visibleColumns,
            state.viewport.scrollLeft,
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
        return [...this.dataProcessors].reduce((data, processor) => processor(data), this.getState().data);
    }

    public getRowId(row: T, index: number): RowId {
        return this.resolveRowId(row, index);
    }

    public setData(data: T[]): void {
        this.assertActive();
        this.store.setState({ data });
        this.events.emit("dataChange", data);
    }

    public setViewport(viewport: Partial<ViewportState>): void {
        this.assertActive();
        const current = this.getState().viewport;
        const nextViewport = { ...current, ...viewport };
        const isUnchanged =
            nextViewport.width === current.width &&
            nextViewport.height === current.height &&
            nextViewport.scrollTop === current.scrollTop &&
            nextViewport.scrollLeft === current.scrollLeft;
        if (isUnchanged) return;
        this.store.setState({ viewport: nextViewport });
        this.events.emit("viewportChange", nextViewport);
    }

    public setColumns(columns: GridState<T>["columns"]): void {
        this.assertActive();
        this.store.setState({ columns });
    }

    public registerDataProcessor(processor: DataProcessor<T>): () => void {
        this.assertActive();
        this.dataProcessors.add(processor);
        const unregister = () => this.dataProcessors.delete(processor);
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

    public destroy(): void {
        if (this.destroyed) return;
        this.cleanupPlugins.forEach((cleanup) => cleanup());
        this.cleanupPlugins.clear();
        this.dataProcessors.clear();
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
