import type { AlchemyRow, MinionRow, SpeedingTicketRow, SuperweaponNode } from "./types";

export type DemoDataset = "minions" | "speedingTickets" | "alchemy" | "superweapon";

export interface SpeedingTicketQuery {
    offset?: number;
    limit?: number;
}

type DatasetOptions = SpeedingTicketQuery & { count?: number };

export type DatasetResult = MinionRow[] | SpeedingTicketRow[] | AlchemyRow[] | SuperweaponNode;

const MINION_NAMES = ["Goblin Bob", "Doom Susan", "Muffin Golem", "Captain Oops"];
const BOSSES = ["Lord Darkmorth", "The Overlord", "Baron Spreadsheet"];
const SPECIALTIES = ["Laser calibration", "Villain monologues", "Portal maintenance", "Inbox triage"];
const HEALTH_STATUSES: MinionRow["healthStatus"][] = ["healthy", "partially-frogified", "on-leave", "missing"];
const VEHICLES = ["Tuned broomstick", "Saucer XL", "Borrowed comet", "Unlicensed moon buggy"];
const PILOTS = ["Cthulhu Junior", "Zorp McSpeed", "The Late Arriver", "Professor Zoom"];
const SECTORS = ["Andromeda, sector 4A", "Orion belt, lane 9", "Saturn rings, outer lane"];
const EXCUSES = ["Thought a light-year was a suggestion", "The autopilot was emotionally unavailable", "Was late for a wizard council"];

function seeded(seed: number): number {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return value - Math.floor(value);
}

function pick<T>(values: readonly T[], seed: number): T {
    return values[Math.floor(seeded(seed) * values.length)];
}

function createMinions(count: number): MinionRow[] {
    return Array.from({ length: count }, (_, index) => ({
        id: `${String(666 + index).padStart(3, "0")}-${String.fromCharCode(65 + (index % 26))}`,
        name: `${pick(MINION_NAMES, index + 1)} #${index + 1}`,
        boss: pick(BOSSES, index + 2),
        specialty: pick(SPECIALTIES, index + 3),
        salaryGold: 700 + Math.floor(seeded(index + 4) * 2800),
        unionComplaints: Math.floor(seeded(index + 5) * 31),
        healthStatus: pick(HEALTH_STATUSES, index + 6),
        isAlive: seeded(index + 7) > 0.18,
    }));
}

function createSpeedingTickets(query: SpeedingTicketQuery = {}): SpeedingTicketRow[] {
    const offset = Math.max(0, query.offset ?? 0);
    const limit = Math.min(1000, Math.max(1, query.limit ?? 100));

    return Array.from({ length: limit }, (_, index) => {
        const rowNumber = offset + index;
        return {
            ticketId: `TR-${String(994821 + rowNumber).padStart(6, "0")}`,
            pilotName: pick(PILOTS, rowNumber + 1),
            vehicleType: pick(VEHICLES, rowNumber + 2),
            sector: pick(SECTORS, rowNumber + 3),
            speedKmh: 500000 + Math.floor(seeded(rowNumber + 4) * 5000000),
            excuse: pick(EXCUSES, rowNumber + 5),
            fineCredits: 50000 + Math.floor(seeded(rowNumber + 6) * 950000),
        };
    });
}

function createAlchemyRows(count: number): AlchemyRow[] {
    const categories = ["Dragon parts", "Potions", "Cursed antiques"];
    const subCategories = ["Scales and claws", "Invisibility", "Shelf B-13"];
    const items = ["Basilisk tooth", "Visible invisibility tonic", "Polite haunted mirror"];

    return Array.from({ length: count }, (_, index) => {
        const stockQuantity = Math.floor(seeded(index + 8) * 50) + 1;
        const pricePerUnit = Math.round((50 + seeded(index + 9) * 2000) * 100) / 100;
        return {
            id: `ALC-${String(index + 1).padStart(4, "0")}`,
            category: pick(categories, index + 1),
            subCategory: pick(subCategories, index + 2),
            itemName: `${pick(items, index + 3)} ${index + 1}`,
            dangerLevel: Math.floor(seeded(index + 4) * 5) + 1,
            stockQuantity,
            pricePerUnit,
            totalValue: Math.round(stockQuantity * pricePerUnit * 100) / 100,
        };
    });
}

function createSuperweapon(): SuperweaponNode {
    return {
        id: "DS-001",
        name: "The Slightly-Worrying Star",
        componentType: "station",
        status: "under-construction",
        owner: "Mad Scientist Family",
        powerLevel: 100,
        children: [
            {
                id: "DS-001-A",
                name: "Planetary targeting",
                componentType: "system",
                status: "operational",
                owner: "Mad Scientist Family",
                powerLevel: 42,
                children: [
                    {
                        id: "DS-001-A-1",
                        name: "Very large red button",
                        componentType: "module",
                        status: "needs-repair",
                        owner: "Mad Scientist Family",
                        powerLevel: 9,
                    },
                ],
            },
            {
                id: "DS-001-B",
                name: "Coffee reactor",
                componentType: "system",
                status: "operational",
                owner: "Mad Scientist Family",
                powerLevel: 71,
            },
        ],
    };
}

export async function getDemoDataset(dataset: DemoDataset, options: DatasetOptions = {}): Promise<DatasetResult> {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    switch (dataset) {
        case "minions":
            return createMinions(Math.max(1, options.count ?? 100));
        case "speedingTickets":
            return createSpeedingTickets(options);
        case "alchemy":
            return createAlchemyRows(Math.max(1, options.count ?? 100));
        case "superweapon":
            return createSuperweapon();
    }
}
