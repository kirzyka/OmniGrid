import type { ColumnDef, GridOptions } from '@omnigrid/core';
import { useEffect, useRef, type CSSProperties, type ReactNode, type UIEvent } from 'react';
import { useGrid } from './useGrid';

export interface GridProps<T> extends GridOptions<T> {
  className?: string;
  style?: CSSProperties;
  renderCell?: (value: unknown, row: T, column: ColumnDef<T>) => ReactNode;
}

function getCellValue<T>(row: T, column: ColumnDef<T>): unknown {
  if (column.accessor) return column.accessor(row);
  if (column.field) return row[column.field];
  return undefined;
}

export function OmniGrid<T>({
  className,
  style,
  renderCell,
  ...options
}: GridProps<T>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const { grid, viewportData } = useGrid(options);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const updateSize = () => {
      grid.setViewport({ width: element.clientWidth, height: element.clientHeight });
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

  return (
    <div
      ref={viewportRef}
      className={className}
      onScroll={handleScroll}
      style={{ overflow: 'auto', position: 'relative', ...style }}
    >
      <div style={{ height: viewportData.totalHeight, minWidth: viewportData.totalWidth, position: 'relative' }}>
        {viewportData.rows.map((row) => (
          <div
            key={row.id}
            role="row"
            style={{ display: 'contents' }}
          >
            {viewportData.columns.map((item) => {
              const value = getCellValue(row.data, item.column);
              return (
                <div
                  key={`${row.id}:${item.column.id}`}
                  role="cell"
                  style={{
                    height: grid.getState().rowHeight,
                    left: item.offset,
                    overflow: 'hidden',
                    position: 'absolute',
                    top: row.offset,
                    width: item.width,
                  }}
                >
                  {renderCell ? renderCell(value, row.data, item.column) : String(value ?? '')}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}