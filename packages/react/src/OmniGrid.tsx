import { type CSSProperties, type ReactNode, type UIEvent, useCallback, useEffect, useRef, useState } from "react";

import type { ColumnDef, GridOptions, RowRenderParams, RowStyle, SlotMount, SlotName, SlotPosition, SlotRenderContext } from "@omnigrid/core";
import { DomPool } from "@omnigrid/core";

import { type ContentBridge, contentToReactNode } from "./content";
import { type PooledColumn, type PooledRowCallbacks, PooledRowPane } from "./pooledRow";
import { createCellRoot } from "./reactRoot";
import { useGrid } from "./useGrid";

/**
 * Registry of native adapter components for `SlotComponentContent`:
 *   slotComponents={{ ["my-widget"]: (payload, context) => <MyWidget .../> }}
 */
export interface SlotRendererRegistry<T> {
    [kind: string]: (payload: unknown, context: SlotRenderContext<T>) => ReactNode;
}

export interface GridProps<T> extends GridOptions<T> {
    className?: string;
    style?: CSSProperties;
    slotComponents?: SlotRendererRegistry<T>;
}

function getCellValue<T>(row: T, column: ColumnDef<T>): unknown {
    if (column.valueGetter) return column.valueGetter(row);
    if (column.field) return row[column.field];
    return undefined;
}

const SLOT_POSITIONS: SlotPosition[] = ["start", "center", "end"];

/**
 * React adapter over the headless core.
 *
 * Rows are rendered via the DOM Pool: a fixed number of nodes that, on scroll,
 * only change `transform: translateY` (position) and update content in-place
 * (textContent / innerHTML / isolated createRoot) — without node creation
 * or React reconciliation on the scroll hot path.
 *
 * Scroll position is decoupled from React's render cycle: `Grid.setViewport`
 * for scroll-only updates does NOT notify the Store, so React does NOT
 * re-render on every scroll frame. React re-renders only on structural
 * changes (data, columns, dimensions) and column-window changes (header only).
 *
 * Slots (`top` / `bottom` / `left` / `right`) are materialised from the
 * core's headless content; React components in slots are connected via
 * `slotComponents`.
 */
export function OmniGrid<T>({ className, style, slotComponents, ...options }: GridProps<T>) {
    const { grid, viewportData } = useGrid(options);

    const viewportRef = useRef<HTMLDivElement>(null);
    const rowsLayerRef = useRef<HTMLDivElement>(null);
    const [isMeasured, setIsMeasured] = useState(false);
    const scrollFrameRef = useRef<{ id: number; top: number; left: number }>({ id: 0, top: 0, left: 0 });
    const poolRef = useRef<DomPool<T> | null>(null);
    const panesRef = useRef<PooledRowPane<T>[]>([]);
    const paneMapRef = useRef<WeakMap<object, PooledRowPane<T>>>(new WeakMap());
    const optionsRef = useRef<GridOptions<T>>(options);
    const columnsRef = useRef<PooledColumn<T>[]>([]);
    const revisionRef = useRef(-1);
    const processedRef = useRef<unknown[] | null>(null);
    const columnWindowKeyRef = useRef("");
    const scrollbarWidthRef = useRef(0);
    const slotComponentsRef = useRef<SlotRendererRegistry<T>>({});

    // `columnWindowVersion` is a simple counter that increments each time the
    // horizontal column window changes (i.e., when scrollLeft crosses a
    // column boundary). It exists solely to trigger a targeted React re-render
    // of the header — row DOM nodes remain managed by the DomPool and are
    // never touched by React's reconciliation.
    const [, setColumnWindowVersion] = useState(0);

    optionsRef.current = options;
    slotComponentsRef.current = slotComponents ?? {};

    const autoHeight = style?.height === undefined;
    const measuredHeight = viewportData.totalHeight + grid.getState().rowHeight;
    const viewportStyle = { ...style, height: autoHeight ? measuredHeight : style?.height };
    const suppressRowHoverHighlight = options.suppressRowHoverHighlight ?? false;
    const viewportClassName = ["omnigrid", className, suppressRowHoverHighlight ? "omnigrid-no-row-hover" : null].filter(Boolean).join(" ");
    const rowHeight = grid.getState().rowHeight;

    /**
     * Bridge between the core's headless content and React: a registry of
     * slot components and a factory for the current render context.
     */
    const buildBridge = (): ContentBridge<T> => ({
        registry: slotComponentsRef.current,
        context: () => ({ api: grid, state: grid.getState(), slot: undefined }),
    });
    /** Row panel callbacks: close over grid/options, never over DOM. */
    const buildRowCallbacks = (bridge: ContentBridge<T>): PooledRowCallbacks<T> => {
        const current = () => optionsRef.current;
        return {
            rowHeight,
            renderCellContent: (info) => {
                const column = info.column;
                const value = getCellValue(info.data, column);
                if (column.cellRenderer) {
                    return column.cellRenderer({ value, data: info.data, column, id: info.rowId, index: info.rowIndex });
                }
                return column.valueFormatter ? column.valueFormatter(value) : String(value ?? "");
            },
            resolveRowClasses: (row) => {
                const rowParams: RowRenderParams<T> = { id: row.rowId, index: row.index, data: row.data };
                const currentOptions = current();
                const rowClass = typeof currentOptions.rowClass === "function" ? currentOptions.rowClass(rowParams) : currentOptions.rowClass;
                const dynamicRowClass = currentOptions.getRowClass?.(rowParams);
                const ruleClasses = Object.entries(currentOptions.rowClassRules ?? {})
                    .filter(([, predicate]) => predicate(rowParams))
                    .map(([ruleClass]) => ruleClass);
                return ["omnigrid-row", rowClass, ...ruleClasses, dynamicRowClass].filter(Boolean).join(" ");
            },
            resolveRowStyle: (row) => {
                const rowParams: RowRenderParams<T> = { id: row.rowId, index: row.index, data: row.data };
                const currentOptions = current();
                const baseRowStyle: RowStyle = {
                    ...(currentOptions.rowStyle ?? {}),
                    ...(currentOptions.getRowStyle?.(rowParams) ?? {}),
                };
                return (currentOptions.plugins ?? []).reduce<RowStyle>(
                    (styleAcc, plugin) => ({ ...styleAcc, ...(plugin.getRowStyle?.(rowParams) ?? {}) }),
                    baseRowStyle,
                );
            },
            onRowClick: (row, modifiers) =>
                grid.rowClick({
                    id: row.rowId,
                    index: row.index,
                    data: row.data,
                    ctrlKey: modifiers.ctrlKey,
                    shiftKey: modifiers.shiftKey,
                }),
            onRowHover: (row, hovered) => grid.rowHover({ id: row.rowId, index: row.index, data: row.data, hovered }),
            onCellClick: (row, column, modifiers) => {
                if (column.stopRowClick) return;
                grid.rowClick({
                    id: row.rowId,
                    index: row.index,
                    data: row.data,
                    ctrlKey: modifiers.ctrlKey,
                    shiftKey: modifiers.shiftKey,
                });
            },
            createRoot: (container) => createCellRoot(container),
        };
    };

    /** Creates the DOM pool after the first DOM layer is available (post-measurement). */
    const ensurePool = (): void => {
        if (poolRef.current) return;
        const layer = rowsLayerRef.current;
        if (!layer) return;

        const bridge = buildBridge();
        poolRef.current = new DomPool<T>({
            rowHeight,
            getRowId: (row, index) => grid.getRowId(row, index),
            bindings: {
                createRow: () => {
                    const element = document.createElement("div");
                    layer.appendChild(element);
                    const pane = new PooledRowPane<T>(element, buildRowCallbacks(bridge), bridge);
                    paneMapRef.current.set(element, pane);
                    panesRef.current.push(pane);
                    return element;
                },
                bindRow: (host, row) => {
                    const pane = paneMapRef.current.get(host);
                    if (pane) pane.bind(row, columnsRef.current);
                },
                transformRow: (host, offsetY) => {
                    const pane = paneMapRef.current.get(host);
                    if (pane) pane.setOffsetY(offsetY);
                },
                recycleRow: (host) => {
                    const pane = paneMapRef.current.get(host);
                    if (pane) pane.recycle();
                },
            },
        });
    };

    /**
     * Synchronises the DomPool with the grid. Idempotent — called both from
     * React effects (structural changes) and directly from the scroll rAF
     * handler (imperative, no React re-render).
     */
    const syncPool = (): void => {
        ensurePool();
        const pool = poolRef.current;
        if (!pool) return;
        if (grid.isDestroyed()) return;

        const state = grid.getState();
        const currentViewportData = grid.getViewportData();
        const columns = currentViewportData.columns;
        columnsRef.current = columns;

        // Structural changes (data / columns / refresh) require rebinding
        // visible rows; pure scroll does not.
        const revision = grid.getRevision();
        if (revisionRef.current !== revision) {
            revisionRef.current = revision;
            pool.invalidate();
        }
        const processed = grid.getProcessedData();
        if (processedRef.current !== processed) {
            processedRef.current = processed;
            pool.invalidate();
        }

        // The rowRange is computed by the Grid's single Virtualizer using
        // the ephemeral scroll position (read inside getViewportData()).
        // The DomPool trusts this range and does NOT virtualize on its own.
        pool.update({
            data: processed,
            rowRange: currentViewportData.rowRange,
            rowHeight: state.rowHeight,
            rowWidth: currentViewportData.totalWidth,
        });

        // The horizontal column window changes infrequently (only when
        // crossing column boundaries). When it does, update row cells
        // imperatively AND trigger a targeted React re-render for the header.
        const columnWindowKey = `${currentViewportData.columnRange.start}:${currentViewportData.columnRange.end}:${state.viewport.width}`;
        if (columnWindowKey !== columnWindowKeyRef.current) {
            columnWindowKeyRef.current = columnWindowKey;
            for (const pane of panesRef.current) pane.updateColumns(columns);
            setColumnWindowVersion((v) => v + 1);
        }
    };

    /**
     * Measures viewport dimensions from the DOM and syncs them to the core.
     * Called on mount and on ResizeObserver events.
     *
     * The available content width (clientWidth) already excludes the scrollbar
     * width. When `scrollbar-gutter: stable` is active (modern browsers), the
     * browser reserves scrollbar space permanently, so clientWidth is stable
     * whether or not the scrollbar is visible. For browsers without support,
     * the scroll handler re-measures when the scrollbar appears/disappears.
     */
    const measureViewport = useCallback(() => {
        const element = viewportRef.current;
        if (!element) return;
        const scrollbarWidth = element.offsetWidth - element.clientWidth;
        scrollbarWidthRef.current = scrollbarWidth;
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (width === 0 || height === 0) return;
        grid.setViewport({ width, height });
        setIsMeasured(true);
    }, [grid]);

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) return;

        const observer = new ResizeObserver(() => {
            const element = viewportRef.current;
            if (!element) return;
            const scrollbarWidth = element.offsetWidth - element.clientWidth;
            scrollbarWidthRef.current = scrollbarWidth;
            const width = element.clientWidth;
            const height = element.clientHeight;
            if (width === 0 || height === 0) return;
            grid.setViewport({ width, height });
            setIsMeasured(true);
        });
        observer.observe(element, { box: "content-box" });
        measureViewport();
        return () => observer.disconnect();
    }, [grid, measureViewport]);

    /**
     * Sync the DomPool after every structural re-render.
     * This runs only when React actually re-renders (data / columns /
     * dimensions / column-window changes), never on scroll.
     *
     * Adapter options (rowClassRules closures, getRowStyle, plugins) can
     * change between renders WITHOUT touching the grid revision or the data
     * reference — e.g. a rule toggled by a useState in the host component.
     * Force-rebind the visible nodes so row classes/styles are re-evaluated
     * with the fresh options on every render.
     */
    useEffect(() => {
        if (poolRef.current) poolRef.current.invalidate();
        syncPool();
    });

    useEffect(() => {
        return () => {
            if (scrollFrameRef.current.id) cancelAnimationFrame(scrollFrameRef.current.id);
            poolRef.current?.destroy();
            poolRef.current = null;
            panesRef.current = [];
            paneMapRef.current = new WeakMap();
            rowsLayerRef.current?.replaceChildren();
        };
    }, []);

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        const element = event.currentTarget;
        const frame = scrollFrameRef.current;
        frame.top = element.scrollTop;
        frame.left = element.scrollLeft;

        // Detect scrollbar appearance/disappearance. When the vertical
        // scrollbar appears it reduces clientWidth; if the grid previously
        // measured without the scrollbar, we re-measure to avoid a phantom
        // horizontal scrollbar. (With `scrollbar-gutter: stable` this is a
        // no-op in modern browsers.)
        const scrollbarWidth = element.offsetWidth - element.clientWidth;
        if (scrollbarWidth !== scrollbarWidthRef.current) {
            scrollbarWidthRef.current = scrollbarWidth;
            grid.setViewport({ width: element.clientWidth });
        }

        if (frame.id) return;
        frame.id = window.requestAnimationFrame(() => {
            frame.id = 0;
            // Read the live scroll position directly from the DOM. This is a
            // safety net for cases where scroll events are coalesced or missed
            // (e.g. releasing the mouse outside the scrollbar thumb). The rAF
            // always reflects the most recent scrollTop, even if the last
            // onScroll event was at a different intermediate position.
            const element = viewportRef.current;
            const scrollTop = element ? element.scrollTop : frame.top;
            const scrollLeft = element ? element.scrollLeft : frame.left;
            // setViewport with scroll-only updates does NOT notify the Store,
            // so this does NOT trigger a React re-render. The DomPool is
            // updated imperatively below.
            grid.setViewport({ scrollTop, scrollLeft });
            syncPool();
        });
    };

    if (!isMeasured) {
        return (
            <div
                ref={viewportRef}
                className={viewportClassName}
                style={{
                    ...viewportStyle,
                    overflowX: "auto",
                    overflowY: autoHeight ? "hidden" : "auto",
                    position: "relative",
                    scrollbarGutter: "stable",
                }}
            />
        );
    }

    /** Resolves headless slot content into a ReactNode (see contentToReactNode). */
    const resolveSlotContent = (mount: SlotMount<T>, context: SlotRenderContext<T>): ReactNode => {
        const raw = typeof mount.content === "function" ? mount.content(context) : mount.content;
        return contentToReactNode<T>(raw, { registry: slotComponentsRef.current, context: () => context });
    };

    const renderSlot = (slot: SlotName): ReactNode => {
        const mounts = grid.getSlotMounts(slot);
        if (mounts.length === 0) return null;

        const context: SlotRenderContext<T> = { api: grid, state: grid.getState(), slot };
        return (
            <div className={`omnigrid-slot omnigrid-slot-${slot}`}>
                {SLOT_POSITIONS.map((position) => {
                    const group = mounts.filter((mount) => mount.position === position);
                    if (group.length === 0) return null;
                    return (
                        <div key={position} className={`omnigrid-slot-item-group omnigrid-slot-pos-${position}`}>
                            {group.map((mount) => (
                                <div key={mount.id} className="omnigrid-slot-item">
                                    {resolveSlotContent(mount, context)}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="omnigrid-layout" style={style}>
            {renderSlot("top")}
            <div className="omnigrid-layout-body">
                {renderSlot("left")}
                <div
                    ref={viewportRef}
                    className={viewportClassName}
                    onScroll={handleScroll}
                style={{
                    ...viewportStyle,
                    flex: "1 1 0",
                    height: autoHeight ? measuredHeight : "100%",
                    minHeight: 0,
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: autoHeight ? "hidden" : "auto",
                    position: "relative",
                    scrollbarGutter: "stable",
                    width: "100%",
                }}
                >
                    <div
                        style={{
                            height: viewportData.totalHeight + rowHeight,
                            position: "relative",
                            width: `max(100%, ${viewportData.totalWidth}px)`,
                        }}
                    >
                        <div
                            role="row"
                            className="omnigrid-header-row"
                            style={{
                                height: rowHeight,
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                width: "100%",
                            }}
                        >
                            {viewportData.columns.map((item) => (
                                <div
                                    key={item.column.id}
                                    role="columnheader"
                                    className="omnigrid-header-cell"
                                    data-sort={item.column.sortState}
                                    data-sortable={item.column.sortable === true ? "true" : undefined}
                                    aria-sort={item.column.sortState === "asc" ? "ascending" : item.column.sortState === "desc" ? "descending" : "none"}
                                    onClick={(event) =>
                                        item.column.stopHeaderClick
                                            ? event.stopPropagation()
                                            : grid.headerClick(item.column.id, event.shiftKey || event.ctrlKey || event.metaKey)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") grid.headerClick(item.column.id);
                                    }}
                                    tabIndex={0}
                                    style={{
                                        alignItems: "center",
                                        display: "flex",
                                        fontWeight: 600,
                                        overflow: "hidden",
                                        padding: "0 12px",
                                        position: "absolute",
                                        left: item.offset,
                                        top: 0,
                                        bottom: 0,
                                        whiteSpace: "nowrap",
                                        width: item.width,
                                    }}
                                >
                                    {item.column.headerRenderer ? (
                                        contentToReactNode(item.column.headerRenderer(item.column), {
                                            registry: slotComponentsRef.current,
                                            context: () => ({ api: grid, state: grid.getState(), slot: undefined }),
                                        })
                                    ) : (
                                        <>
                                            <span className="omnigrid-header-label">{item.column.header ?? item.column.id}</span>
                                            <span className="omnigrid-header-tools">
                                                {item.column.sortState && (
                                                    <span className="omnigrid-sort-indicator" aria-hidden="true">
                                                        {item.column.sortState === "asc" ? "▲" : "▼"}
                                                    </span>
                                                )}
                                            </span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div
                            ref={rowsLayerRef}
                            data-pool-layer="true"
                            style={{
                                height: viewportData.totalHeight,
                                left: 0,
                                position: "absolute",
                                top: rowHeight,
                                width: "100%",
                            }}
                        />
                    </div>
                </div>
                {renderSlot("right")}
            </div>
            {renderSlot("bottom")}
        </div>
    );
}
