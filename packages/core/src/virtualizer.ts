import type { ColumnDef, Range, VirtualItem } from './types';

export interface VirtualizerOptions {
  rowHeight: number;
  rowOverscan: number;
  columnOverscan: number;
}

export class Virtualizer<T> {
  private readonly options: VirtualizerOptions;

  public constructor(options: VirtualizerOptions) {
    this.options = options;
  }

  public getRowRange(count: number, scrollTop: number, viewportHeight: number): Range {
    return this.getRange(count, this.options.rowHeight, scrollTop, viewportHeight, this.options.rowOverscan);
  }

  public getColumnRange(
    columns: ColumnDef<T>[],
    scrollLeft: number,
    viewportWidth: number,
  ): Range {
    const offsets = this.getColumnOffsets(columns);
    const start = this.findStart(offsets, scrollLeft);
    const end = this.findEnd(offsets, scrollLeft + viewportWidth);
    return {
      start: Math.max(0, start - this.options.columnOverscan),
      end: Math.min(columns.length, end + 1 + this.options.columnOverscan),
    };
  }

  public getColumnOffsets(columns: ColumnDef<T>[]): VirtualItem[] {
    let offset = 0;
    return columns.map((column, index) => {
      const size = this.getColumnWidth(column);
      const item = { index, offset, size };
      offset += size;
      return item;
    });
  }

  public getTotalHeight(rowCount: number): number {
    return rowCount * this.options.rowHeight;
  }

  public getTotalWidth(columns: ColumnDef<T>[]): number {
    return this.getColumnOffsets(columns).reduce((total, item) => total + item.size, 0);
  }

  private getRange(
    count: number,
    itemSize: number,
    scrollOffset: number,
    viewportSize: number,
    overscan: number,
  ): Range {
    if (count === 0) return { start: 0, end: 0 };
    const start = Math.floor(Math.max(0, scrollOffset) / itemSize);
    const end = Math.ceil((Math.max(0, scrollOffset) + Math.max(0, viewportSize)) / itemSize);
    return {
      start: Math.max(0, start - overscan),
      end: Math.min(count, end + overscan),
    };
  }

  private getColumnWidth(column: ColumnDef<T>): number {
    const width = column.width ?? 120;
    return Math.min(column.maxWidth ?? Infinity, Math.max(column.minWidth ?? 40, width));
  }

  private findStart(items: VirtualItem[], offset: number): number {
    return items.findIndex((item) => item.offset + item.size > offset) === -1
      ? items.length
      : items.findIndex((item) => item.offset + item.size > offset);
  }

  private findEnd(items: VirtualItem[], offset: number): number {
    return items.findIndex((item) => item.offset >= offset) === -1
      ? items.length
      : items.findIndex((item) => item.offset >= offset);
  }
}
