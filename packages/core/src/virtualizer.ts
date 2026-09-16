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
    const offsets = this.getColumnOffsets(columns, viewportWidth);
    const start = this.findStart(offsets, scrollLeft);
    const end = this.findEnd(offsets, scrollLeft + viewportWidth);
    return {
      start: Math.max(0, start - this.options.columnOverscan),
      end: Math.min(columns.length, end + 1 + this.options.columnOverscan),
    };
  }

  public getColumnOffsets(columns: ColumnDef<T>[], viewportWidth = 0): VirtualItem[] {
    const widths = this.getColumnWidths(columns, viewportWidth);
    let offset = 0;
    return columns.map((column, index) => {
      const size = widths[index];
      const item = { index, offset, size };
      offset += size;
      return item;
    });
  }

  public getTotalHeight(rowCount: number): number {
    return rowCount * this.options.rowHeight;
  }

  public getTotalWidth(columns: ColumnDef<T>[], viewportWidth = 0): number {
    return this.getColumnOffsets(columns, viewportWidth).reduce((total, item) => total + item.size, 0);
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

  private getColumnWidths(columns: ColumnDef<T>[], viewportWidth: number): number[] {
    const widths = columns.map((column) => this.getBaseColumnWidth(column));
    const flexIndexes = columns
      .map((column, index) => (column.flex && column.flex > 0 ? index : -1))
      .filter((index) => index >= 0);

    if (flexIndexes.length === 0) return widths;

    const fixedWidth = widths.reduce(
      (total, width, index) => flexIndexes.includes(index) ? total : total + width,
      0,
    );
    const minimumFlexWidth = flexIndexes.reduce(
      (total, index) => total + this.getMinColumnWidth(columns[index]),
      0,
    );
    let remaining = Math.max(0, viewportWidth - fixedWidth - minimumFlexWidth);
    const activeIndexes = new Set(flexIndexes);

    flexIndexes.forEach((index) => {
      widths[index] = this.getMinColumnWidth(columns[index]);
    });

    while (remaining > 0 && activeIndexes.size > 0) {
      const flexTotal = [...activeIndexes].reduce(
        (total, index) => total + (columns[index].flex ?? 0),
        0,
      );
      let distributed = 0;

      activeIndexes.forEach((index) => {
        const column = columns[index];
        const share = remaining * (column.flex ?? 0) / flexTotal;
        const available = this.getMaxColumnWidth(column) - widths[index];
        const addition = Math.min(share, Math.max(0, available));
        widths[index] += addition;
        distributed += addition;

        if (addition < share) activeIndexes.delete(index);
      });

      if (distributed === 0) break;
      remaining -= distributed;
    }

    return widths;
  }

  private getBaseColumnWidth(column: ColumnDef<T>): number {
    if (column.flex && column.flex > 0) return this.getMinColumnWidth(column);
    const width = column.width ?? 120;
    return Math.min(this.getMaxColumnWidth(column), Math.max(this.getMinColumnWidth(column), width));
  }

  private getMinColumnWidth(column: ColumnDef<T>): number {
    return Math.max(0, column.minWidth ?? 40);
  }

  private getMaxColumnWidth(column: ColumnDef<T>): number {
    return Math.max(this.getMinColumnWidth(column), column.maxWidth ?? Infinity);
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
