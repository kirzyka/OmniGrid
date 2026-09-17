import type { CellRendererParams } from '@omnigrid/react';
import type { DemoRow, Status } from '../data/demoData';

const STATUS_LABELS: Record<Status, string> = {
  active: 'Активен',
  pending: 'Ожидает',
  blocked: 'Заблокирован',
  archived: 'В архиве',
};

const STATUS_COLORS: Record<Status, string> = {
  active: '#2e8b57',
  pending: '#b7791f',
  blocked: '#c0392b',
  archived: '#95a5a6',
};

function resolveStatus(value: unknown): Status {
  return typeof value === 'string' && value in STATUS_LABELS
    ? (value as Status)
    : 'archived';
}

/**
 * Кастомный рендерер ячейки «Статус».
 * Соответствует сигнатуре ColumnDef.cellRenderer и возвращает ReactNode.
 */
export function statusRenderer({ value }: CellRendererParams<DemoRow>): unknown {
  const status = resolveStatus(value);
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      style={{
        alignItems: 'center',
        display: 'inline-flex',
        gap: 6,
        paddingLeft: 8,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          backgroundColor: color,
          borderRadius: '50%',
          display: 'inline-block',
          height: 8,
          width: 8,
        }}
      />
      {label}
    </span>
  );
}