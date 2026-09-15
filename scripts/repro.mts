/* Воспроизведение ошибки "Grid has been destroyed" в React.StrictMode */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173/',
  pretendToBeVisual: true,
});

const g: any = globalThis;
for (const key of [
  'window', 'document', 'navigator', 'Node', 'Element', 'HTMLElement', 'SVGElement',
  'Event', 'CustomEvent', 'MutationObserver', 'getComputedStyle',
  'requestAnimationFrame', 'cancelAnimationFrame',
]) {
  if (key in dom.window) {
    try {
      g[key] = (dom.window as any)[key];
    } catch {
      Object.defineProperty(g, key, { value: (dom.window as any)[key], configurable: true, writable: true });
    }
  }
}
g.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
g.IS_REACT_ACT_ENVIRONMENT = true;

const errors: string[] = [];
const React = (await import('react')).default;
const { createRoot } = await import('react-dom/client');
const { OmniGrid, useGrid, Grid } = await import('@omnigrid/react');

class Boundary extends React.Component<any, any> {
  state = { error: null };
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any) {
    errors.push(`BOUNDARY: ${error?.stack ?? error}`);
  }
  render() {
    if (this.state.error) return React.createElement('div', null, '!!!error!!!');
    return this.props.children;
  }
}

function makeApp(extra?: any): React.ReactElement {
  return React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      Boundary,
      null,
      React.createElement(OmniGrid, {
        columns: [
          { id: 'a', field: 'a', header: 'A', width: 120 },
          { id: 'b', field: 'b', header: 'B', width: 120 },
        ],
        data: [
          { a: '1', b: '2' },
          { a: '3', b: '4' },
        ],
        ...extra,
      }),
    ),
  );
}

// -------- Тест 1: текущий useGrid (без destroy в cleanup) --------
{
  const root = createRoot(document.getElementById('root')!);
  try {
    root.render(makeApp());
    await new Promise((r) => setTimeout(r, 300));
    root.unmount();
    console.log('TEST 1 (current useGrid, StrictMode):', errors.length === 0 ? 'OK — ошибки нет' : 'CRASH -> ' + errors.join(' | '));
  } catch (e: any) {
    console.log('TEST 1 SYNC THROW:', e?.stack ?? e);
  }
  errors.length = 0;
}

// -------- Тест 2: классический паттерн с destroy() в cleanup --------
{
  const root = createRoot(document.getElementById('root')!);
  function useGridWithDestroy(options: any) {
    const [grid] = React.useState(() => new Grid(options));
    React.useEffect(() => {
      grid.setData(options.data ?? []);
      return () => grid.destroy(); // так часто пишут "правильно", но это ломает StrictMode
    }, [grid, options.data]);
    return { grid, state: null, viewportData: grid.getViewportData() };
  }
  const Evil = (props: any) => {
    useGridWithDestroy(props);
    return React.createElement('div');
  };
  try {
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(Boundary, null, React.createElement(Evil, {
          columns: [{ id: 'a', field: 'a', width: 120 }],
          data: [{ a: '1' }],
        })),
      ),
    );
    await new Promise((r) => setTimeout(r, 300));
    root.unmount();
    console.log('TEST 2 (destroy in cleanup, StrictMode):', errors.length === 0 ? 'OK (неожиданно)' : 'CRASH ВОСПРОИЗВЕДЁН -> ' + errors[0].split('\n').slice(0, 6).join(' | '));
  } catch (e: any) {
    console.log('TEST 2 SYNC THROW:', e?.stack ?? e);
  }
}

process.exit(0);