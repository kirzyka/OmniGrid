import type { SlotManager } from "./slots";

export type RowId = string | number;
export type SortDirection = "asc" | "desc";
export type CellAlign = "left" | "center" | "right";
export type DataProcessor<T> = (data: T[]) => T[];

export interface CellRendererParams<T> {
    value: unknown;
    data: T;
    column: ColumnDef<T>;
    id?: RowId;
    index?: number;
}

export interface RowRenderParams<T> {
    id: RowId;
    index: number;
    data: T;
}

export interface RowStyle {
    [property: string]: string | number | undefined;
}

/**
 * Dynamic rules for assigning CSS classes to rows.
 *
 * The key is the CSS class name, the value is a predicate that receives row
 * parameters (`RowRenderParams`) and returns `true` when the class should be
 * applied. Rules are dynamic: re-evaluated on every viewport commit and
 * applied in batch to all visible rows at once.
 */
export type RowClassRules<T> = Record<string, (params: RowRenderParams<T>) => boolean>;

export interface CheckboxRenderParams {
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
    ariaLabel: string;
    onChange: (event: { shiftKey: boolean; ctrlKey: boolean }) => void;
}

export interface CheckboxControl extends CheckboxRenderParams {
    type: "@omnigrid/checkbox";
}

export interface ColumnDef<T> {
    id: string;
    header?: string;
    align?: CellAlign;
    field?: keyof T;
    valueGetter?: (row: T) => unknown;
    cellRenderer?: (params: CellRendererParams<T>) => unknown;
    headerRenderer?: (column: ColumnDef<T>) => unknown;
    stopRowClick?: boolean;
    stopHeaderClick?: boolean;
    valueFormatter?: (value: unknown) => string;
    width?: number;
    flex?: number;
    minWidth?: number;
    maxWidth?: number;
    hidden?: boolean;
    sortable?: boolean;
    sortState?: SortDirection;
}

export interface GridOptions<T> {
    data?: T[];
    columns: ColumnDef<T>[];
    getRowId?: (row: T, index: number) => RowId;
    rowHeight?: number;
    rowOverscan?: number;
    columnOverscan?: number;
    suppressRowHoverHighlight?: boolean;
    rowStyle?: RowStyle;
    getRowStyle?: (params: RowRenderParams<T>) => RowStyle | undefined;
    rowClass?: string | ((params: RowRenderParams<T>) => string | undefined);
    getRowClass?: (params: RowRenderParams<T>) => string | undefined;
    rowClassRules?: RowClassRules<T>;
    plugins?: GridPlugin<T>[];
}

export interface ViewportState {
    width: number;
    height: number;
    scrollTop: number;
    scrollLeft: number;
}

/** Ephemeral scroll position — not stored in the Store (no React re-render on scroll). */
export interface ScrollPosition {
    scrollTop: number;
    scrollLeft: number;
}

export interface Range {
    start: number;
    end: number;
}

export interface VirtualItem {
    index: number;
    offset: number;
    size: number;
}

export interface ViewportData<T> {
    rows: Array<{ id: RowId; data: T; index: number; offset: number }>;
    columns: Array<{ column: ColumnDef<T>; index: number; offset: number; width: number }>;
    rowRange: Range;
    columnRange: Range;
    totalWidth: number;
    totalHeight: number;
}

export interface GridState<T> {
    data: T[];
    columns: ColumnDef<T>[];
    viewport: ViewportState;
    rowHeight: number;
    rowOverscan: number;
    columnOverscan: number;
}

export interface GridEvents<T> {
    stateChange: GridState<T>;
    viewportChange: ViewportState;
    dataChange: T[];
    headerClick: { columnId: string; multiSort: boolean };
    rowClick: RowClickEvent<T>;
    rowHover: RowHoverEvent<T>;
    slotsChange: { slot: SlotName; mounts: SlotMount<T>[] };
}

/* ------------------------------------------------------------------ */
/* DOM Pool — reusable row nodes (core manages the "pool slot → row   */
/* index" mapping; DOM is touched only by the adapter via the          */
/* injected bindings contract).                                        */
/* ------------------------------------------------------------------ */

/** Opaque token for a row node owned by the adapter. */
export type RowHost<T> = object;

/** Data snapshot for binding a row node in the pool. */
export interface PooledRow<T> {
    index: number;
    rowId: RowId;
    data: T;
    offsetY: number;
    height: number;
    /** Pixel width of the row (sum of all column widths) — used to size the row node. */
    width: number;
}

/**
 * Injected node operations. The adapter implements these (e.g. setting
 * `textContent` and `transform: translateY`), while the core decides
 * WHEN and WHICH node to update.
 */
export interface DomPoolBindings<T> {
    createRow(): RowHost<T>;
    bindRow(host: RowHost<T>, row: PooledRow<T>): void;
    transformRow(host: RowHost<T>, offsetY: number): void;
    recycleRow(host: RowHost<T>): void;
}

/** Result of a viewport frame update (informational for tests/debugging). */
export interface DomPoolUpdate<T> {
    windowStart: number;
    windowEnd: number;
    poolSize: number;
    bound: Array<{ host: RowHost<T>; row: PooledRow<T> }>;
    positioned: Array<{ host: RowHost<T>; offsetY: number }>;
    recycled: RowHost<T>[];
}

export interface RowClickEvent<T> extends RowRenderParams<T> {
    ctrlKey: boolean;
    shiftKey: boolean;
}

export interface RowHoverEvent<T> extends RowRenderParams<T> {
    hovered: boolean;
}

export interface GridPlugin<T> {
    name: string;
    register(api: GridApi<T>): void | (() => void);
    getRowStyle?(params: RowRenderParams<T>): RowStyle | undefined;
}

/* ------------------------------------------------------------------ */
/* Slot Architecture — panels where plugins mount their widgets       */
/* ------------------------------------------------------------------ */

export type SlotName = "top" | "bottom" | "left" | "right";
export type SlotPosition = "start" | "center" | "end";
export type SlotNodeEventName = "click" | "change" | "keydown";

/**
 * Context passed to the slot content provider. Headless: the plugin
 * works only with the core API and state — no DOM or framework code.
 */
export interface SlotRenderContext<T> {
    api: GridApi<T>;
    state: GridState<T>;
    slot?: SlotName;
}

/** Raw HTML fragment (adapter inserts via innerHTML). */
export interface SlotHtmlContent {
    type: "html";
    html: string;
}

/**
 * Declarative DOM node for a slot: the adapter materializes it into a real
 * element and binds handlers. This lets a headless plugin (e.g. pagination)
 * create buttons without depending on React / Vue / Svelte.
 */
export interface SlotNodeContent<T> {
    type: "node";
    tag: string;
    attrs?: Record<string, string | number | boolean | undefined>;
    on?: Partial<Record<SlotNodeEventName, (context: SlotRenderContext<T>) => void>>;
    children?: SlotContent[];
}

/**
 * Request for a native adapter component: the adapter keeps a registry
 * `kind → renderer` and mounts a full component (e.g. a React component)
 * directly into the slot.
 */
export interface SlotComponentContent {
    type: "component";
    kind: string;
    payload?: unknown;
}

/**
 * Headless description of slot content. The value is opaque (just like the
 * result of `cellRenderer`): the core stores and propagates it as `unknown`,
 * and the adapter materializes it according to a documented runtime protocol:
 *
 *   - `string | number`                  → plain text;
 *   - `SlotHtmlContent`                  → HTML fragment;
 *   - `SlotNodeContent`                  → declarative DOM node;
 *   - `SlotComponentContent`             → component from the adapter registry;
 *   - any other object                    → framework-native value
 *     (in the React adapter this is a `ReactNode`, including React components).
 */
export type SlotContent = unknown;

/** Static content or a function that computes it on each render. */
export type SlotProvider<T> = SlotContent | ((context: SlotRenderContext<T>) => SlotContent);

export interface SlotMountOptions {
    /** Stable identifier (needed for unmount and key-preserving re-render). */
    id?: string;
    /** Order within the slot: lower comes first (default 0). */
    priority?: number;
    /** Alignment group within the slot (default "start"). */
    position?: SlotPosition;
}

export interface SlotMount<T> {
    id: string;
    slot: SlotName;
    content: SlotProvider<T>;
    priority: number;
    position: SlotPosition;
    unmount(): void;
}

export interface GridApi<T> {
    getState(): GridState<T>;
    getScrollPosition(): ScrollPosition;
    getViewportData(): ViewportData<T>;
    getProcessedData(): T[];
    getRowId(row: T, index: number): RowId;
    setData(data: T[]): void;
    setViewport(viewport: Partial<ViewportState>): void;
    refresh(): void;
    subscribe(listener: () => void): () => void;
    on<EventName extends keyof GridEvents<T>>(event: EventName, listener: (payload: GridEvents<T>[EventName]) => void): () => void;
    registerPlugin(plugin: GridPlugin<T>): () => void;
    registerDataProcessor(processor: DataProcessor<T>): () => void;
    setColumns(columns: ColumnDef<T>[]): void;
    headerClick(columnId: string, multiSort?: boolean): void;
    rowClick(row: RowClickEvent<T>): void;
    rowHover(row: RowHoverEvent<T>): void;
    readonly slots: SlotManager<T>;
    getSlotMounts(slot: SlotName): SlotMount<T>[];
    /** Monotonic counter for structural changes (refresh / data / columns). */
    getRevision(): number;
    destroy(): void;
    isDestroyed(): boolean;
}
