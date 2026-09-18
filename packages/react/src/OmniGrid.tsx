import { type CSSProperties, type ReactNode, type UIEvent, useEffect, useRef, useState } from "react";

import type { ColumnDef, GridOptions } from "@omnigrid/core";

import { useGrid } from "./useGrid";

export interface GridProps<T> extends GridOptions<T> {
    className?: string;
    style?: CSSProperties;
}

function getCellValue<T>(row: T, column: ColumnDef<T>): unknown {
    if (column.accessor) return column.accessor(row);
    if (column.field) return row[column.field];
    return undefined;
}

export function OmniGrid<T>({ className, style, ...options }: GridProps<T>) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [isMeasured, setIsMeasured] = useState(false);
    const { grid, viewportData } = useGrid(options);

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
        return (
            <div ref={viewportRef} className={className} style={{ overflow: "auto", position: "relative", ...style }} />
        );
    }

    return (
        <div
            ref={viewportRef}
            className={className}
            onScroll={handleScroll}
            style={{ background: "#ffffff", overflow: "auto", position: "relative", ...style }}
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
                    style={{
                        background: "#e9eef5",
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
                            aria-sort={
                                item.column.sortState === "asc"
                                    ? "ascending"
                                    : item.column.sortState === "desc"
                                      ? "descending"
                                      : "none"
                            }
                            onClick={(event) =>
                                grid.headerClick(item.column.id, event.shiftKey || event.ctrlKey || event.metaKey)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") grid.headerClick(item.column.id);
                            }}
                            tabIndex={0}
                            style={{
                                alignItems: "center",
                                borderBottom: "1px solid #c5cfdd",
                                borderRight: "1px solid #c5cfdd",
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
                            <span className="omnigrid-header-label">{item.column.header ?? item.column.id}</span>
                            <span className="omnigrid-header-tools">
                                {item.column.sortState && (
                                    <span className="omnigrid-sort-indicator" aria-hidden="true">
                                        {item.column.sortState === "asc" ? "▲" : "▼"}
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
                {viewportData.rows.map((row) => (
                    <div key={row.id} role="row" style={{ display: "contents" }}>
                        {viewportData.columns.map((item) => {
                            const value = getCellValue(row.data, item.column);
                            return (
                                <div
                                    key={`${row.id}:${item.column.id}`}
                                    role="cell"
                                    style={{
                                        height: grid.getState().rowHeight,
                                        left: item.offset,
                                        overflow: "hidden",
                                        position: "absolute",
                                        top: row.offset + grid.getState().rowHeight,
                                        width: item.width,
                                    }}
                                >
                                    {item.column.cellRenderer
                                        ? (item.column.cellRenderer({
                                              value,
                                              data: row.data,
                                              column: item.column,
                                          }) as ReactNode)
                                        : item.column.valueFormatter
                                          ? item.column.valueFormatter(value)
                                          : String(value ?? "")}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
