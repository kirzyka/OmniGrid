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

  const subscribe = useCallback(
    (listener: () => void) => grid.subscribe(listener),
    [grid],
  );
  const getSnapshot = useCallback(() => grid.getState(), [grid]);
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Синхронизируем данные в ядро при смене ссылки на массив (async-загрузка,
  // пагинация, фильтры на стороне родителя). Без этого данные, подгруженные
  // после монтирования, «застревают» в первом рендере и грид остаётся пустым.
  useEffect(() => {
    if (grid.isDestroyed()) return;
    grid.setData(options.data ?? []);
  }, [grid, options.data]);

  // То же для колонок: адаптер обязан отражать изменения props.
  useEffect(() => {
    if (grid.isDestroyed()) return;
    grid.setColumns(options.columns);
  }, [grid, options.columns]);

  return {
    grid,
    state,
    viewportData: grid.getViewportData(),
  };
}