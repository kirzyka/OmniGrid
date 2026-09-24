# OmniGrid Architecture

## 1. Purpose

OmniGrid is an extensible component for rendering large tabular data sets. The primary goal of the project is to decouple data and state management from the visual representation, so that the same engine can be used with different UI frameworks.

The project is structured as a **headless framework**:

- The core does not create DOM and does not depend on React, Vue, Svelte, or any other framework;
- The core manages data, state, events, and table geometry;
- An adapter binds the core to a specific UI framework;
- A renderer displays only the necessary portion of the table;
- Extended functionality is added through plugins rather than embedded in the minimal core.

This separation enables:

- Testing business logic without a browser;
- Reusing the Core in different environments;
- Controlling performance on large data sets.

## 2. Architecture Overview

The design has three pillars:

1. **Vanilla-TS Core with native DOM rendering** — the core manages a fixed pool of reusable DOM row nodes and positions them via `transform: translateY()`. No framework is imported at this layer.

2. **DOM Pooling & DOM Pool** — the core maintains a fixed set of row hosts (exactly enough to fill the viewport + overscan). On scroll, nodes are repositioned via `transform` and their content is updated in-place (`textContent`, `innerHTML`, or an isolated React portal). Nodes are never created or destroyed during normal scrolling. This fully eliminates row flicker and blinking.

3. **Framework adapter as configuration** — React (and future adapters) act as a configuration/bridge layer. The adapter injects DOM operations via `DomPoolBindings` and provides cell/header rendering contracts. React components inside cells are mounted point-to-point through `ReactDOM.createRoot` into reusable pooled cells when those cells enter the viewport.

```text
+-------------------------------------------------------------+
|           Adapter / Binding (React, Vue, Svelte)            |
|  useSyncExternalStore for config  ·  DomPoolBindings (DOM)  |
|  Column/header JSX                 ·  createRoot for cells   |
+-------------+---------------+-------------------+-------------+
              |               |                   |
              v               v                   v
+------------------------+  +----------------+  +-----------------+
|     UI Renderer        |  |   DOM Pool     |  |  Cell ReactRoot |
|  Header (JSX)          |  |  Row hosts     |  |  (createRoot)   |
|  Slots (JSX)           |  |  transform Y   |  |  portal mount   |
+------------------------+  +----------------+  +-----------------+
              |               |                   |
              +-------┬-------+           +-------+
                      |                   |
          +-----------v--------------------v----------+
          |                 Grid Core                 |
          |  Grid API | State Store | Event Bus       |
          |  Data Pipeline | Virtualizer | DomPool    |
          |  Slot Manager | Plugin Manager            |
          +----------------------+--------------------+
                                 |
          +----------------------v--------------------+
          |         Raw Data / External Data Source     |
          +---------------------------------------------+
```

### 2.1 Core Engine

The framework-agnostic layer written in pure TypeScript. It must:

- Accept raw rows and column definitions;
- Store and mutate grid state;
- Perform filtering, sorting, grouping, and pagination;
- Calculate visible rows and columns;
- Provide a stable public API;
- Emit events;
- Register and disable plugins.

The core separates **scroll position** from **structural state**. Scroll-only updates (`scrollTop` / `scrollLeft`) are stored in an ephemeral field and never notify the Store — this guarantees that no scroll frame triggers a React re-render. Only dimension changes (resize), data changes, or structural changes notify the Store and trigger re-renders.

The core does **not** import `document`, `window`, DOM events, or any UI-framework API. Viewport dimensions and scroll position are fed to it through explicit API calls (`setViewport`, `getScrollPosition`). All DOM manipulation is delegated to the adapter through injected `DomPoolBindings`.

### 2.2 Adapter / Binding Layer

The adapter transforms the declarative model of a specific framework into Core calls and back:

- Creates a Grid instance;
- Subscribes the component to structural state changes (only when revision changes, not on scroll);
- Passes viewport dimensions and row measurements to Core;
- Provides `DomPoolBindings` that perform the actual DOM operations;
- Provides cell/header rendering contracts for framework-native renderers (e.g. React components);
- Correctly tears down subscriptions and the Grid instance.

The adapter must not duplicate sorting, filtering, or virtualization logic — these belong to the Core.

For the first UI adapter, the package `packages/react` provides the `useGrid` hook and the `OmniGrid` component.

### 2.3 UI Renderer

The renderer receives prepared data and geometry from Core:

- Array of visible rows;
- Array of visible columns (column window);
- Coordinates and sizes of elements;
- State of selection, editing, and loading;
- Handlers for user actions.

The renderer is responsible only for DOM and accessibility. It must not recompute the full data set and must not render rows or columns outside the virtual window.

The `packages/style` package contains shared styles, CSS variables, and visual conventions, without mixing them with Core logic.

## 3. Core Entities and Contracts

### 3.1 ColumnDef

`ColumnDef<T>` describes a column:

- A unique `id`;
- A key or accessor for extracting the value from a row;
- A header label;
- Width and width constraints;
- Flags for sortability, filterability, and editability;
- Cell renderer and header renderer;
- Optional formatting and comparison functions.

A column definition must not contain state specific to a viewport. State of width, order, and visibility is stored in the State Store.

### 3.2 RowNode

`RowNode<T>` is the internal representation of a row after passing through the Data Pipeline. In addition to the original data, it may contain:

- A stable `id`;
- An index in the processed set;
- A nesting level;
- Parent and child nodes for grouping or tree data;
- Flags for expansion, selection, and editing;
- Metadata for positioning.

A stable row identifier is required for correct DOM recycling, selection preservation, and data-update handling.

### 3.3 GridOptions

`GridOptions<T>` holds the grid configuration:

- Source data or data source;
- `ColumnDef[]`;
- Default row height;
- Overscan for rows and columns;
- Row styling options: `rowStyle` (inline style applied per row), `rowClass` (static CSS class that persists across data updates), `rowClassRules` (dynamic CSS classes applied in batch);
- Selection, sorting, and filtering settings;
- Grouping, pagination, and editing modes;
- List of plugins;
- Callbacks or event settings.

Configuration options are separated from mutable runtime state.

### 3.4 GridState

State is divided into independent areas:

```text
GridState
├── data
│   ├── rawRows
│   └── processedRows metadata
├── columns
│   ├── order
│   ├── widths
│   └── visibility
├── viewport
│   ├── width / height
│   ├── scrollTop / scrollLeft
│   ├── visible row range
│   └── visible column range
├── interaction
│   ├── focused cell
│   ├── selected rows / cells
│   └── editing cell
└── pipeline
    ├── filters
    ├── sorting
    ├── grouping
    └── pagination
```

The Store provides atomic updates, subscriptions, and the ability to read current state without binding to UI. Updating one area must not unnecessarily notify subscribers of other areas.

## 4. Data Processing Pipeline

Data passes through a sequential transformation chain:

```text
Raw Data
  -> Filter Engine
  -> Sort Engine
  -> Grouping / Aggregation Engine
  -> Pagination Engine
  -> Row Model
  -> Virtualization Engine
  -> Viewport Data
```

Each stage must have a clear input and output. This allows:

- Enabling or disabling stages;
- Replacing an implementation via a plugin;
- Testing operations in isolation;
- Moving heavy stages into a Web Worker in the future.

### 4.1 Filter Engine

A filter receives an array of rows and filter descriptions, returning a new logical set or index of rows. Filtering must not mutate the user's original data.

### 4.2 Sort Engine

Sorting must use explicit column comparators and be stable, so rows with equal values maintain a predictable order.

### 4.3 Grouping and Aggregation Engine

These stages form a hierarchical Row Model:

- Group rows;
- Leaf rows;
- Nesting levels;
- Expansion state;
- Aggregated values.

On MVP, grouping may be absent from basic Core and provided as a separate plugin.

### 4.4 Pagination Engine

Pagination limits the processed set to a page. It is optional: virtualization and pagination solve different problems and can be used together or independently.

## 5. Virtualization and DOM Pooling

OmniGrid uses two-dimensional virtualization combined with **DOM Pooling**. Only the rows and columns intersecting the viewport (plus an `overscan` buffer) are rendered in the DOM.

### 5.1 DOM Pool (Row Recycling)

The core maintains a fixed pool of row DOM nodes — exactly enough to fill the viewport plus overscan. The pool size never grows during normal scrolling.

On each scroll frame:

1. The Virtualizer computes the visible row range `[start, end)` from the current scroll position.
2. The pool maps "pool slot i → row index `start + i`".
3. For each slot:
    - If the row index changed → call `bindings.bindRow(host, row)` to update content (textContent, innerHTML, or React root).
    - If the `translateY` offset changed → call `bindings.transformRow(host, offsetY)`.
4. Nodes that fell outside the window are cleared and moved off-screen (`transform: translateY(-200000px)`), but the DOM nodes are **not destroyed** — they are recycled for the next frame.

Because nodes are only repositioned (composite-only `transform`) and their content is updated in-place, **there is no flicker, no blinking, and no reflow** during scroll — even at 60 FPS with a 100,000-row data set.

### 5.2 Vertical Virtualization

For a fixed row height:

```text
startIndex = floor(scrollTop / rowHeight) - overscan
endIndex   = ceil((scrollTop + viewportHeight) / rowHeight) + overscan
```

Indices are clamped to the data range. The full scroll-container height is preserved via a spacer element, and visible rows are positioned inside the viewport.

For dynamic row height, the Virtualizer uses a table of measured heights and accumulated offsets. Measurement is performed by the adapter via `ResizeObserver` and passed back to the Core.

### 5.3 Horizontal Virtualization

For columns, the range is computed from `scrollLeft` and viewport width. With fixed widths, prefix sums or accumulated offsets are used:

```text
columnStart = first column whose offset + width >= scrollLeft
columnEnd   = last column whose offset <= scrollLeft + viewportWidth
```

Column widths and order come from state, so resizing columns does not require reprocessing all rows.

### 5.4 Overscan

Overscan adds several rows and columns beyond the current viewport. It reduces the chance of blank areas during fast scrolling at the cost of additional DOM nodes.

Independent `rowOverscan` and `columnOverscan` are recommended. In the future, the buffer could be adjusted based on scroll velocity.

### 5.5 Positioning

The recommended approach for MVP:

- An outer scroll container with full virtual width and height;
- An inner viewport with `position: relative`;
- Rows and cells with `position: absolute`;
- Positioning via `transform: translate3d(...)`;
- Column widths via CSS variables or computed inline styles.

Canvas may be considered for specialized scenarios with a very large number of simple cells, but the standard renderer must remain HTML/CSS to preserve accessibility, text selection, and interactive controls.

## 6. State Store and Reactivity

The State Store is a lightweight observable store based on subscriptions.

The minimal API includes:

```ts
interface Store<State> {
    getState(): State;
    setState(update: Partial<State> | ((state: State) => Partial<State>)): void;
    subscribe(listener: () => void): () => void;
}
```

Practical requirements:

- `setState` is synchronous and predictable;
- Subscription returns an unsubscribe function;
- Updates are batchable if the adapter requires it;
- Core does not depend on React state or any external state library;
- Runtime state must not be mutated directly from the renderer.

**Scroll decoupling:** The grid keeps an ephemeral `scrollPosition` field separate from the Store. Scroll-only updates (`scrollTop` / `scrollLeft`) update this field and emit a `viewportChange` event, but they do **not** call `Store.setState()` — so `useSyncExternalStore` in the React adapter does not fire, and React does not re-render on scroll. Only dimension changes (resize), data changes, or structural changes notify the Store.

## 7. Scroll Performance Model

### 7.1 Zero-React Scroll Path

The scroll handler captures `scrollTop` / `scrollLeft` from the DOM and feeds them to `grid.setViewport()`. Because `setViewport` detects a scroll-only change and updates the ephemeral `scrollPosition` field without touching the Store, the following happens **without a single React re-render**:

```text
scroll event
  → handleScroll captures scrollTop/scrollLeft
  → requestAnimationFrame
      → grid.setViewport({ scrollTop, scrollLeft })  // updates scrollPosition, no Store notification
      → syncPool()                                    // reads scrollPosition, updates DomPool
          → DomPool.update(viewport)
              → Virtualizer.getRowRange(...)          // O(1) with cache
              → transformRow (composite-only)         // position change
              → bindRow (only for new rows)           // content update
              → recycleRow (off-screen nodes)
```

### 7.2 Header Column Window

The header is rendered via React JSX. To avoid re-rendering the header on every scroll frame, a `columnWindowVersion` counter is incremented **only** when the horizontal column window actually changes (i.e., when `scrollLeft` crosses a column boundary). This triggers a targeted React re-render of the header only — row DOM nodes remain managed by the DomPool and are never touched by React's reconciliation.

### 7.3 Structural Re-render Path

Structural changes (data set, columns, resize) increment the grid's `revision` counter and notify the Store. The React adapter re-renders, calls `syncPool()` (via a `useEffect`), and the DomPool rebinds visible rows (via `pool.invalidate()` + `pool.update()`).

### 7.4 Cell Rendering Bridge

Cell content that is a React component is rendered through an isolated `ReactDOM.createRoot` instance mounted in the cell's DOM element. The root persists for the lifetime of the cell (not the row) — on scroll, only `root.render(newContent)` is called, never `createRoot` + `unmount`. This avoids React tree recreation on the scroll path.

## 8. Event Bus and Grid API

The Event Bus transmits events between Core, adapters, and plugins. An event must have a typed name and payload.

Example events:

- `viewportChange`;
- `cellClick`;
- `cellDoubleClick`;
- `rowSelect`;
- `sortChange`;
- `filterChange`;
- `columnResize`;
- `columnReorder`;
- `editStart`, `editCommit`, `editCancel`;
- `dataChange`.

The public `GridApi` provides commands and subscriptions:

```ts
interface GridApi<T> {
    getState(): GridState<T>;
    getScrollPosition(): { scrollTop: number; scrollLeft: number };
    getViewportData(): ViewportData<T>;
    getProcessedData(): T[];
    getRowId(row: T, index: number): RowId;
    setData(data: T[]): void;
    setViewport(viewport: Partial<ViewportState>): void;
    refresh(): void;
    subscribe(listener: () => void): () => void;
    on<EventName>(event: EventName, listener: GridListener<EventName>): () => void;
    registerPlugin(plugin: GridPlugin<T>): () => void;
    registerDataProcessor(processor: DataProcessor<T>): () => void;
    setColumns(columns: ColumnDef<T>[]): void;
    headerClick(columnId: string, multiSort?: boolean): void;
    rowClick(row: RowClickEvent<T>): void;
    rowHover(row: RowHoverEvent<T>): void;
    readonly slots: SlotManager<T>;
    getSlotMounts(slot: SlotName): SlotMount<T>[];
    getRevision(): number;
    destroy(): void;
    isDestroyed(): boolean;
}
```

The API must be the single point of interaction between the adapter and the external application. UI components must not access Core internals directly.

## 9. Plugin Architecture

The minimal core provides lifecycle hooks and an extension API. Complex capabilities are implemented as plugins.

```ts
interface GridPlugin<T> {
    name: string;
    register(api: GridApi<T>): void | (() => void);
}
```

A plugin can:

- Subscribe to events;
- Read and update state through the public API;
- Add commands to the API via a consistent extension mechanism;
- Attach pipeline stages;
- Perform cleanup on disablement.

A plugin must not modify private Core fields and must not directly manage DOM.

Expected plugins:

- Sorting;
- Filtering;
- Pagination;
- Row and cell selection;
- Range selection;
- Column resize;
- Column reorder;
- Grouping and aggregation;
- Tree data;
- Inline editing;
- Web Worker data processing.

Plugin registration order must be deterministic. If plugins add pipeline stages, the Core explicitly fixes the execution order and conflict-resolution rules.

## 10. Slot System

The root grid container is divided into zones: `top`, `bottom`, `left`, `right`, and the body area.

Plugins register their components in these slots through a simple API:

```ts
grid.slots.register("bottom", PaginationPlugin);
```

The Slot Manager (`SlotManager`) stores headless content descriptions (`SlotContent`) and propagates changes to adapters. The adapter materializes the content according to its own protocol:

- `string | number` → plain text;
- `SlotHtmlContent` → HTML fragment via `innerHTML`;
- `SlotNodeContent` → declarative DOM node;
- `SlotComponentContent` → framework-native component from an adapter registry;
- any other object → framework-native value (e.g. `ReactNode`).

## 11. Render Flow and User Actions

### 11.1 Initial Render

1. The application creates a Grid via the adapter.
2. Core initializes configuration, Store, Event Bus, and plugins.
3. The adapter passes viewport dimensions.
4. The Data Pipeline builds the Row Model.
5. The Virtualizer computes visible row and column ranges.
6. The DomPool creates the initial set of row nodes.
7. The renderer displays the header and visible rows.

### 11.2 Scrolling

1. The scroll container reports new `scrollTop` and `scrollLeft` to the adapter.
2. The adapter calls `api.setViewport({ scrollTop, scrollLeft })`.
3. Core updates the ephemeral scroll position (Store is NOT notified).
4. The adapter calls `syncPool()` imperatively (via rAF).
5. The DomPool repositions and rebinds nodes as needed.
6. **No React re-render occurs.** Only `viewportChange` event fires.

If the horizontal column window changed, `syncPool` increments `columnWindowVersion`, triggering a targeted React re-render of the header only.

### 11.3 Data or Filter Change

1. External code calls `setData` or modifies a filter.
2. Core invalidates the relevant pipeline stages.
3. A new Row Model is built.
4. Row count, offsets, and viewport range are recomputed.
5. The Store state changes and `revision` is incremented.
6. React re-renders (structural change), `syncPool()` rebinds visible rows.

## 12. Performance Guidelines

Key performance rules:

- Never render the full set of rows or columns;
- Separate Data Pipeline execution from scroll position updates;
- Use stable identifiers for rows and columns;
- Minimize payload size in events and subscriptions;
- Do not create new renderer functions for each cell unnecessarily;
- Measure dynamic rows only after they have been rendered;
- Update CSS column widths without recreating the table;
- Use `transform` for repositioning visible elements;
- Perform heavy processing in a Web Worker for data sets of 100,000 rows or more;
- Cancel stale worker tasks or version results by data revision.

Performance must be measured on realistic scenarios:

- 100,000+ rows;
- Many columns with horizontal scrolling;
- Fast vertical and horizontal scrolling;
- Frequent filter changes;
- Dynamic row height;
- Bulk selection.

### 12.1 Measured Scroll Metrics

| Scenario                        | Target                                                                      |
| ------------------------------- | --------------------------------------------------------------------------- |
| Vertical scroll (fixed height)  | No React re-renders. Row repositioning via `transform` only.                |
| Horizontal scroll (no col swap) | No React re-renders. Row cell repositioning via `transform` only.           |
| Horizontal scroll (column swap) | Single React re-render of header only. Row cells repositioned imperatively. |
| React cell components           | `createRoot` reused per cell. No node recreation on scroll.                 |

## 13. Accessibility and UI Behavior

The headless architecture does not eliminate accessibility requirements. The adapter and renderer must support:

- Semantic table structure or an equivalent ARIA model;
- Keyboard navigation;
- Visible focus indicators;
- Correct `aria-rowindex` and `aria-colindex` during virtualization;
- Announcements of sort state and selection;
- Correct behavior of interactive editors.

Virtualization must not alter the semantic position of a row for screen readers. DOM indices must reflect the row's position in the full table, not just its position within the current viewport window.

## 14. Package Structure

Responsibility is split across packages:

```text
packages/
├── core/
│   ├── types          — Core types and interfaces
│   ├── state          — Observable Store
│   ├── events         — Typed EventBus
│   ├── pipeline       — Data processing chain
│   ├── virtualization — Virtualizer + DomPool
│   ├── plugins        — Extension lifecycle
│   └── api            — Grid class and public API
├── react/
│   ├── useGrid        — React lifecycle binding
│   ├── OmniGrid       — React component (header + slots)
│   └── React bindings — DomPoolBindings + CellRoot + content bridge
└── style/
    ├── CSS variables  — Design tokens
    ├── layout styles  — Structural CSS
    └── default visual styles
```

In the future, similar adapters can be split into separate `vue` and `svelte` packages. These must use the same Core contract without duplicating its logic.

## 15. Testing Strategy

### Core

Unit tests should cover:

- Virtualization range calculation;
- Viewport boundaries and overscan;
- Sorting and filtering;
- Identifier stability;
- State transitions;
- EventBus subscription and cleanup;
- Plugin lifecycle;
- Offset recalculation on resize.

### Adapter and Renderer

Integration tests should verify:

- Grid creation and destruction;
- Passing dimensions and scroll positions to Core;
- DOM updates after state changes;
- Focus and selection preservation;
- Behavior on prop changes;
- Accessibility attributes for virtualized rows and columns.

### Performance Checks

Separate benchmark scenarios are needed for large data sets. Benchmarks should not replace functional tests but should record processed row count, DOM node count, and scroll/filter response time.

## 16. Implementation Roadmap

### Phase 1: MVP — Core and Virtualization

1. Define `ColumnDef`, `GridOptions`, `RowNode`, `GridState`, `ViewportData`.
2. Implement Store and minimal Grid API.
3. Implement a vertical Virtualizer for fixed row height.
4. Implement `DomPool` with fixed node pool and `transform`-based positioning.
5. Create React `useGrid` and `OmniGrid` with DomPool bindings.
6. Add HTML/CSS rendering for visible rows.
7. Add horizontal virtualization for columns.

### Phase 2: Data and Events

1. Implement the Data Pipeline.
2. Add client-side sorting and filtering.
3. Add a typed EventBus.
4. Implement base events: `cellClick`, `rowSelect`, `sortChange`, `filterChange`.
5. Support dynamic row height via `ResizeObserver`.

### Phase 3: Plugins and Interaction

1. Fix the Plugin lifecycle API.
2. Extract sorting and filtering into plugins.
3. Implement cell, row, and range selection.
4. Add column resizing.
5. Add column reordering via drag-and-drop.

### Phase 4: Advanced Features

1. Grouping and aggregation.
2. Tree data.
3. Pagination and server-side data sources.
4. Web Worker adapter for heavy processing.
5. Inline editing and a set of cell editors.
6. Advanced performance benchmarks and accessibility audits.

## 17. Architectural Constraints

The following constraints preserve the boundaries of the system:

- Core does not import UI frameworks or DOM APIs;
- The renderer does not perform business operations on the full data set;
- Plugins operate through the public API and lifecycle hooks;
- Runtime state cannot be mutated directly from the adapter;
- Virtualization must not change the order of rows in the Row Model;
- Sorting, filtering, and grouping must not mix with DOM-position calculation;
- Web Worker implementations must uphold the same pipeline contract as synchronous implementations.

## 18. Readiness Criteria

The architecture is considered implemented at a basic level when:

- Core can run and be tested without a DOM;
- The React adapter renders a table through the public Grid API;
- Only visible rows and overscan reside in the DOM for large data sets;
- Vertical and horizontal scrolling do not re-process unchanged data;
- Plugins can add functionality without modifying the base renderer;
- State, events, and the pipeline have typed contracts;
- Grid and plugin lifecycles correctly clean up subscriptions and resources.

Additionally, for the DOM pooling model specifically:

- No React re-render occurs during pure scroll;
- Row DOM nodes are recycled (not recreated) on scroll;
- Content in visible cells is updated in-place via `textContent` / `innerHTML` / isolated `createRoot`;
- Horizontal column-window changes trigger at most a single header re-render.
