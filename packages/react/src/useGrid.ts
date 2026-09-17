import type { GridOptions, GridState, ViewportData } from '@omnigrid/core';
import { Grid } from '@omnigrid/core';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

export interface UseGridResult<T> {
  grid: Grid<T>;
  state: GridState<T>;
  viewportData: ViewportData<T>;
}

/**
 * Связывает экземпляр Grid из @omnigrid/core с жизненным циклом React.
 *
 * ВНИМАНИЕ про destroyed-инцидент:
 * НЕ добавляйте `return () => grid.destroy()` в cleanup эффекта!
 * В dev-режиме React.StrictMode выполняет цикл mount: setup → cleanup → setup.
 * Если cleanup уничтожит grid, второй setup (grid.setData) упадёт с
 * «Grid has been destroyed». Чтобы этого не происходило:
 *   - destroy() НЕ вызывается автоматически (жизненный цикл grid управляется
 *     самим ядром/пользователем, а не React);
 *   - все обращения к grid защищены проверкой grid.isDestroyed().
 */
export function useGrid<T>(options: GridOptions<T>): UseGridResult<T> {
  // Не используем ленивый инициализатор useState: в StrictMode React может
  // вызвать его дважды, что дважды зарегистрирует один и тот же plugin.
  const gridRef = useRef<Grid<T> | null>(null);
  if (!gridRef.current) gridRef.current = new Grid(options);
  const grid = gridRef.current;

  // options (и options.data) — новые объекты на КАЖДОМ рендере родителя.
  // Через ref эффект реагирует только на смену данных, а не на новый массив.
  const dataRef = useRef(options.data);
  dataRef.current = options.data;

  const subscribe = useCallback(
    (listener: () => void) => grid.subscribe(listener),
    [grid],
  );
  const getSnapshot = useCallback(() => grid.getState(), [grid]);
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    // StrictMode: setup → cleanup → setup. Если grid уже уничтожен
    // (destroy вызван даже вне этого хука), пропускаем синхронизацию
    // вместо падения с «Grid has been destroyed».
    if (grid.isDestroyed()) return;
    grid.setData(dataRef.current ?? []);
  }, [grid]);

  return {
    grid,
    state,
    viewportData: grid.getViewportData(),
  };
}