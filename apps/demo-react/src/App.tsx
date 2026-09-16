
import { OmniGrid, type ColumnDef } from '@omnigrid/react';
import '@omnigrid/style/index.css';
import { useMemo } from 'react';
import './style/app.css';
interface DemoRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'active' | 'pending' | 'blocked' | 'archived';
  amount: number;
  quantity: number;
  createdAt: string;
  notes: string;
}

/** Детерминированный псевдослучайный генератор [0..1) на основе индекса. */
function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

const CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Екатеринбург',
  'Новосибирск',
  'Нижний Новгород',
];

const STATUSES: DemoRow['status'][] = ['active', 'pending', 'blocked', 'archived'];

const FIRST_NAMES = [
  'Иван', 'Пётр', 'Анна', 'Мария', 'Дмитрий', 'Ольга', 'Сергей', 'Екатерина',
  'Алексей', 'Наталья', 'Максим', 'Татьяна', 'Владимир', 'Юлия', 'Николай', 'Светлана',
];

const LAST_NAMES = [
  'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Васильев', 'Попов', 'Новиков',
  'Козлов', 'Морозов', 'Волков', 'Соколов', 'Лебедев', 'Ковалёв', 'Павлов', 'Орлов',
];

const NOTE_TEMPLATES = [
  'Заявка в обработке',
  'Требуется уточнение',
  'Оплачено, ожидает доставки',
  'Просроченная заявка',
  'VIP-клиент',
  'Согласовано с менеджером',
  'Отменено клиентом',
  'Активная сделка',
];

function createDemoData(): DemoRow[] {
  return Array.from({ length: 1000 }, (_, i) => {
    const firstName = FIRST_NAMES[Math.floor(seeded(i * 7 + 1) * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(seeded(i * 7 + 2) * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const translit = lastName.toLowerCase();

    return {
      id: i + 1,
      name,
      email: `${translit}${i + 1}@example.com`,
      phone: `+7 (9${Math.floor(seeded(i * 7 + 3) * 100000000)
        .toString()
        .padStart(8, '0')
        .slice(0, 8)})`,
      city: CITIES[Math.floor(seeded(i * 7 + 4) * CITIES.length)],
      status: STATUSES[Math.floor(seeded(i * 7 + 5) * STATUSES.length)],
      amount: Math.round(seeded(i * 7 + 6) * 100000) / 100,
      quantity: Math.floor(seeded(i * 7 + 7) * 100) + 1,
      createdAt: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
      notes: NOTE_TEMPLATES[i % NOTE_TEMPLATES.length],
    };
  });
}

const COLUMNS: ColumnDef<DemoRow>[] = [
  { id: 'id', field: 'id', header: 'ID', width: 50 },
  { id: 'name', field: 'name', header: 'Имя', width: 190 },
  { id: 'email', field: 'email', header: 'Email', flex: 1, minWidth: 120 },
  { id: 'phone', field: 'phone', header: 'Телефон', width: 170 },
  { id: 'city', field: 'city', header: 'Город', width: 160 },
  { id: 'status', field: 'status', header: 'Статус', width: 130 },
  { id: 'amount', field: 'amount', header: 'Сумма', width: 130 },
  { id: 'quantity', field: 'quantity', header: 'Кол-во', width: 70 },
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