export type RowId = string | number;
export type SortDirection = "asc" | "desc";
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
    field?: keyof T;
    accessor?: (row: T) => unknown;
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
    plugins?: GridPlugin<T>[];
}

export interface ViewportState {
    width: number;
    height: number;
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

export interface GridApi<T> {
    getState(): GridState<T>;
    getViewportData(): ViewportData<T>;
    getProcessedData(): T[];
    getRowId(row: T, index: number): RowId;
    setData(data: T[]): void;
    setViewport(viewport: Partial<ViewportState>): void;
    subscribe(listener: () => void): () => void;
    on<EventName extends keyof GridEvents<T>>(
        event: EventName,
        listener: (payload: GridEvents<T>[EventName]) => void,
    ): () => void;
    registerPlugin(plugin: GridPlugin<T>): () => void;
    registerDataProcessor(processor: DataProcessor<T>): () => void;
    setColumns(columns: ColumnDef<T>[]): void;
    headerClick(columnId: string, multiSort?: boolean): void;
    rowClick(row: RowClickEvent<T>): void;
    rowHover(row: RowHoverEvent<T>): void;
    destroy(): void;
    isDestroyed(): boolean;
}
