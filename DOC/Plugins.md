# OmniGrid Plugin Plan

This document describes functionality planned for implementation as OmniGrid plugins.

Plugins are connected separately and extend the capabilities of the Grid Core, without overloading the minimal core with functionality that not all users need.

## Base Plugins

**Free / Open Source, MIT license**

Base plugins are included in the standard delivery or connected separately. They are fully open and free.

### Sorting Plugin

Sorting rows by clicking a column header:

- Single sorting;
- Multi-sort across multiple columns;
- Cyclic state switching `asc` / `desc` / `none`.

### Filtering Plugin

Basic data filtering:

- Text search;
- Numeric filters;
- Date filters;
- Value dropdown lists;
- Operators `equals`, `contains`, `greaterThan`.

### Column Resize & Reorder Plugin

Column management:

- Mouse-based column width resizing;
- Double-click auto-resize on column boundaries;
- Column reordering via drag-and-drop in the header.

### Pagination Plugin

Splitting data into pages:

- Page size selection via `pageSize`;
- Page navigation;
- Display of the current range and total row count.

### Selection Plugin

Row and cell selection:

- Selecting individual rows;
- Range selection with `Shift + Click`;
- Multi-selection with `Ctrl + Click`;
- Cell selection;
- Checkbox selection;
- Copying selected data to the clipboard.

### Column Pinning Plugin

Pinning columns during horizontal scroll:

- Pinning to the left via `pin: 'left'`;
- Pinning to the right via `pin: 'right'`.

### Cell Editors Plugin

Basic inline cell editing:

- Launch editing via double-click or the `Enter` key;
- Text fields;
- Numeric fields;
- Checkboxes;
- Simple dropdown lists.

### Column Visibility / ToolPanel Plugin

Managing column visibility:

- Hiding and showing columns;
- Column picker;
- Built-in or dropdown column management panel.

## Paid Plugins

**PRO / Commercial**

Paid plugins are designed for complex enterprise scenarios: large data sets, hierarchies, advanced selection, and export.

### Row Grouping & Aggregation Plugin

Row grouping and aggregate calculation:

- Dragging columns into a special grouping zone;
- Hierarchical group tree;
- Expanding and collapsing groups;
- Aggregates `sum`, `avg`, `min`, `max`, `count`.

### Server-Side Row Model Plugin

Server-side data model for large data sets:

- Lazy data loading;
- Infinite scroll / lazy load;
- Server-side filtering;
- Server-side sorting;
- Datasets with millions of rows.

### Excel & CSV Export Plugin

Exporting table data:

- Exporting visible or all data;
- Export with filters applied;
- Preserving styles and grouping;
- Formats `.xlsx`, `.csv`, and `.pdf`.

### Tree Data Plugin

Displaying nested structures:

- Parent-child relationships;
- Expanding and collapsing branches;
- Organizational structures;
- File managers;
- BOM specifications.

### Master-Detail Plugin

Nested data for rows:

- Expanding a row;
- Displaying a child table;
- Displaying an arbitrary custom component with record details.

### Range Selection & Clipboard Copy Plugin

Excel-like range selection:

- Selecting a rectangular area of cells;
- Copying and pasting via `Ctrl + C` / `Ctrl + V`;
- Auto-fill via fill handle.

### Pivoting Plugin

Interactive pivot tables:

- Building cross-tables;
- Simultaneous grouping by rows and columns;
- Changing dimensions and aggregates by the user.

### Advanced Filters / Filter Builder Plugin

Visual constructor for complex filters:

- Logical operators `AND` and `OR`;
- Condition groups;
- Nested filter groups;
- Filtering scenarios similar to Jira and enterprise CRMs.

## Implementation Principles

- Plugin logic must remain framework-agnostic and reside in the Core or a separate plugin package.
- UI parts — panels, editors, drag-and-drop — must be implemented by framework-specific adapters.
- Base plugins must be available under the MIT license.
- PRO plugins must be connected from separate packages and excluded from the base MIT distribution.
- Every plugin must have its own public API, documentation, and test suite.
