import { type CSSProperties, type ReactNode, type UIEvent, useEffect, useRef, useState } from "react";

import type { CellAlign, CheckboxControl, ColumnDef, GridOptions, RowRenderParams, RowStyle } from "@omnigrid/core";

import { useGrid } from "./useGrid";

export interface GridProps<T> extends GridOptions<T> {
    className?: string;
    style?: CSSProperties;
}

function getCellValue<T>(row: T, column: ColumnDef<T>): unknown {
    if (column.valueGetter) return column.valueGetter(row);
    if (column.field) return row[column.field];
    return undefined;
}

function isCheckboxControl(value: unknown): value is CheckboxControl {
    return typeof value === "object" && value !== null && (value as { type?: unknown }).type === "@omnigrid/checkbox";
}

function renderContent(value: unknown): ReactNode {
    if (!isCheckboxControl(value)) return value as ReactNode;

    return (
        <input
            type="checkbox"
            checked={value.checked}
            disabled={value.disabled}
            aria-label={value.ariaLabel}
            ref={(element) => {
                if (element) element.indeterminate = value.indeterminate;
            }}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
                event.stopPropagation();
                const nativeEvent = event.nativeEvent as MouseEvent;
                value.onChange({ shiftKey: nativeEvent.shiftKey, ctrlKey: nativeEvent.ctrlKey });
            }}
        />
    );
}

const ALIGN_TO_JUSTIFY: Record<CellAlign, string> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
};

export function OmniGrid<T>({ className, style, ...options }: GridProps<T>) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [isMeasured, setIsMeasured] = useState(false);
    const { grid, viewportData } = useGrid(options);
    const autoHeight = style?.height === undefined;
    const measuredHeight = viewportData.totalHeight + grid.getState().rowHeight;
    const viewportStyle = { ...style, height: autoHeight ? measuredHeight : style?.height };
    const suppressRowHoverHighlight = options.suppressRowHoverHighlight ?? false;
    const viewportClassName = ["omnigrid", className, suppressRowHoverHighlight ? "omnigrid-no-row-hover" : null].filter(Boolean).join(" ");

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) return;

        const updateSize = () => {
            const width = element.clientWidth;
            const height = element.clientHeight;
            if (width === 0 || height === 0) return;

            grid.setViewport({ width, height });
            setIsMeasured(true);
        };
        const observer = new ResizeObserver(updateSize);
        observer.observe(element);
        updateSize();
        return () => observer.disconnect();
    }, [grid]);

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        const element = event.currentTarget;
        grid.setViewport({ scrollTop: element.scrollTop, scrollLeft: element.scrollLeft });
    };

    if (!isMeasured) {
        return <div ref={viewportRef} className={viewportClassName} style={{ overflow: "auto", position: "relative", ...viewportStyle }} />;
    }

    return (
        <div
            ref={viewportRef}
            className={viewportClassName}
            onScroll={handleScroll}
            style={{ overflow: "auto", position: "relative", ...viewportStyle }}
        >
            <div
                style={{
                    height: viewportData.totalHeight + grid.getState().rowHeight,
                    minWidth: viewportData.totalWidth,
                    position: "relative",
                }}
            >
                <div
                    role="row"
                    className="omnigrid-header-row"
                    style={{
                        height: grid.getState().rowHeight,
                        minWidth: viewportData.totalWidth,
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
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
                                renderContent(item.column.headerRenderer(item.column))
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
                {viewportData.rows.map((row) => {
                    const rowParams: RowRenderParams<T> = { id: row.id, index: row.index, data: row.data };
                    const rowStyle = options.plugins?.reduce<RowStyle>((style, plugin) => ({ ...style, ...plugin.getRowStyle?.(rowParams) }), {});
                    return (
                        <div
                            key={row.id}
                            role="row"
                            className="omnigrid-row"
                            onMouseDown={(event) => {
                                if (event.shiftKey) event.preventDefault();
                            }}
                            onClick={(event) =>
                                grid.rowClick({
                                    ...rowParams,
                                    ctrlKey: event.ctrlKey || event.metaKey,
                                    shiftKey: event.shiftKey,
                                })
                            }
                            style={{
                                height: grid.getState().rowHeight,
                                left: 0,
                                position: "absolute",
                                top: row.offset + grid.getState().rowHeight,
                                width: "100%",
                                ...rowStyle,
                            }}
                        >
                            {viewportData.columns.map((item) => {
                                const value = getCellValue(row.data, item.column);
                                return (
                                    <div
                                        key={`${row.id}:${item.column.id}`}
                                        role="cell"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            if (!item.column.stopRowClick) {
                                                grid.rowClick({
                                                    ...rowParams,
                                                    ctrlKey: event.ctrlKey || event.metaKey,
                                                    shiftKey: event.shiftKey,
                                                });
                                            }
                                        }}
                                        style={{
                                            backgroundColor: typeof rowStyle?.backgroundColor === "string" ? rowStyle.backgroundColor : undefined,
                                            height: grid.getState().rowHeight,
                                            left: item.offset,
                                            overflow: "hidden",
                                            position: "absolute",
                                            top: 0,
                                            justifyContent: ALIGN_TO_JUSTIFY[item.column.align ?? "left"],
                                            width: item.width,
                                        }}
                                    >
                                        {renderContent(
                                            item.column.cellRenderer
                                                ? item.column.cellRenderer({
                                                      value,
                                                      data: row.data,
                                                      column: item.column,
                                                      id: row.id,
                                                      index: row.index,
                                                  })
                                                : item.column.valueFormatter
                                                  ? item.column.valueFormatter(value)
                                                  : String(value ?? ""),
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
