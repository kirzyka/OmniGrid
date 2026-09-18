export type Status = "active" | "pending" | "blocked" | "archived";

export interface DemoRow {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: string;
    status: Status;
    amount: number;
    quantity: number;
    createdAt: string;
    notes: string;
}

/** Deterministic pseudo-random generator for stable demo data. */
function seeded(seed: number): number {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
}

const CITIES = ["New York", "London", "Toronto", "Singapore", "Amsterdam", "Sydney"];

const STATUSES: Status[] = ["active", "pending", "blocked", "archived"];

const FIRST_NAMES = [
    "Olivia",
    "Liam",
    "Emma",
    "Noah",
    "Ava",
    "Ethan",
    "Mia",
    "Lucas",
    "Sophia",
    "Mason",
    "Isla",
    "James",
    "Amelia",
    "Henry",
    "Grace",
    "Leo",
];

const LAST_NAMES = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
];

const NOTE_TEMPLATES = [
    "Onboarding in progress",
    "Needs clarification",
    "Paid, awaiting delivery",
    "Follow-up overdue",
    "Priority account",
    "Approved by manager",
    "Cancelled by customer",
    "Active opportunity",
];

export function createDemoData(): DemoRow[] {
    return Array.from({ length: 1000 }, (_, i) => {
        const firstName = FIRST_NAMES[Math.floor(seeded(i * 7 + 1) * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(seeded(i * 7 + 2) * LAST_NAMES.length)];
        const name = `${firstName} ${lastName}`;
        const translit = lastName.toLowerCase();

        return {
            id: i + 1,
            name,
            email: `${translit}${i + 1}@example.com`,
            phone: `+1 (2${Math.floor(seeded(i * 7 + 3) * 100000000)
                .toString()
                .padStart(8, "0")
                .slice(0, 8)})`,
            city: CITIES[Math.floor(seeded(i * 7 + 4) * CITIES.length)],
            status: STATUSES[Math.floor(seeded(i * 7 + 5) * STATUSES.length)],
            amount: Math.round(seeded(i * 7 + 6) * 100000) / 100,
            quantity: Math.floor(seeded(i * 7 + 7) * 100) + 1,
            createdAt: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
            notes: NOTE_TEMPLATES[i % NOTE_TEMPLATES.length],
        };
    });
}
