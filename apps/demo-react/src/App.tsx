
import { OmniGrid, type ColumnDef } from '@omnigrid/react';
import '@omnigrid/style/index.css';
import { useMemo } from 'react';
import { createDemoData, type DemoRow } from './data/demoData';
import { statusRenderer } from './renderers/statusRenderer';
import './style/app.css';

const COLUMNS: ColumnDef<DemoRow>[] = [
  { id: 'id', field: 'id', header: 'ID', width: 50 },
  { id: 'name', field: 'name', header: 'Имя', flex: 2, width: 190 },
  { id: 'email', field: 'email', header: 'Email', flex: 1, minWidth: 120 },
  { id: 'phone', field: 'phone', header: 'Телефон', width: 170 },
  { id: 'city', field: 'city', header: 'Город', width: 160 },
  { id: 'status', field: 'status', header: 'Статус', width: 130, cellRenderer: statusRenderer },
  { id: 'amount', field: 'amount', header: 'Сумма', width: 130, valueFormatter: (v: unknown) => typeof v === 'number' ? v.toFixed(2) : Number(v).toFixed(2) },
  { id: 'quantity', field: 'quantity', header: 'Кол-во'},
  { id: 'createdAt', field: 'createdAt', header: 'Дата', width: 120 },
  { id: 'notes', field: 'notes', header: 'Примечание', width: 230 },
];

export function App() {
  const data = useMemo(createDemoData, []);

  return (
    <main className="demo-page">
      <h1>OmniGrid Demo — 1000 строк × 10 колонок</h1>
      <OmniGrid columns={COLUMNS} data={data} style={{ height: '100%', width: '100%' }} />
    </main>
  );
}