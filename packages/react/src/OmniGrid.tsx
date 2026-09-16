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
      style={{ background: '#ffffff', overflow: 'auto', position: 'relative', ...style }}
    >
      <div
        style={{
          height: viewportData.totalHeight + grid.getState().rowHeight,
          minWidth: viewportData.totalWidth,
          position: 'relative',
        }}
      >
        <div
          role="row"
          style={{
            background: '#e9eef5',
            height: grid.getState().rowHeight,
            minWidth: viewportData.totalWidth,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          {viewportData.columns.map((item) => (
            <div
              key={item.column.id}
              role="columnheader"
              style={{
                alignItems: 'center',
                borderBottom: '1px solid #c5cfdd',
                borderRight: '1px solid #c5cfdd',
                display: 'flex',
                fontWeight: 600,
                overflow: 'hidden',
                padding: '0 12px',
                position: 'absolute',
                left: item.offset,
                top: 0,
                bottom: 0,
                whiteSpace: 'nowrap',
                width: item.width,
              }}
            >
              {item.column.header ?? item.column.id}
            </div>
          ))}
        </div>
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
                    top: row.offset + grid.getState().rowHeight,
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