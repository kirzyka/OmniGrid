import { useEffect, useState } from "react";

import type { AlchemyRow, MinionRow, SpeedingTicketRow, SuperweaponNode } from "@/src/data/types";

export interface DatasetOptions {
    offset?: number;
    count?: number;
    delay?: number;
}

export type DatasetResult = MinionRow[] | SpeedingTicketRow[] | AlchemyRow[] | SuperweaponNode;

const FIRST_NAMES = [
    "Bob",
    "Susan",
    "Kevin",
    "Dave",
    "Barnaby",
    "Igor",
    "Carl",
    "Otto",
    "Grizelda",
    "Pippin",
    "Bartholomew",
    "Fizz",
    "Grumble",
    "Olga",
    "Rusty",
];

const LAST_NAMES = [
    "McOof",
    "Doom",
    "Muffin",
    "Blunder",
    "Ironjaw",
    "Butterfinger",
    "Underfoot",
    "Wobbly",
    "Rustbucket",
    "Sparkplug",
    "Bonecrusher",
    "Snicker",
    "Oopsy",
    "Shadowstep",
    "McGoblin",
];

const PREFIXES = ["Captain", "Doctor", "Sir", "Baron", "Chief", "Cadet", "Trainee", "Lord"];

const SUFFIXES = ["Jr.", "III", "II", "IV", "the Clumsy", "the Unlucky", "Esq.", "the Forgetful"];

const BOSSES = ["Lord Darkmorth", "The Overlord", "Baron Spreadsheet"];

const HEALTH_STATUSES: MinionRow["healthStatus"][] = ["healthy", "partially-frogified", "on-leave", "missing"];

const SPECIALTIES = [
    "Laser calibration",
    "Villain monologues",
    "Portal maintenance",
    "Inbox triage",
    "Minion motivation",
    "Cataclysm engineering",
    "Evil laugh tuning",
    "Doomsday device assembly",
    "Lava pit temperature control",
    "Henchman uniform tailoring",
    "Alibi generation",
    "Quantum coffee brewing",
];

const VEHICLES = [
    "Tuned broomstick",
    "Saucer XL",
    "Borrowed comet",
    "Unlicensed moon buggy",
    "Hover-segway of doom",
    "Stealth zeppelin",
    "Jet-powered hammock",
    "Teleportation pod (experimental)",
    "Rusted warp-cart",
    "Anti-gravity unicycle",
    "Exo-skeleton mk.II",
    "Dark matter skateboard",
];

const SECTORS = [
    "Andromeda, sector 4A",
    "Orion belt, lane 9",
    "Saturn rings, outer lane",
    "Nebula X-7, warehouse 4",
    "Deep Space scrapyard 12",
    "Alpha Centauri suburbs",
    "Black hole event horizon (south)",
    "Asteroid 88-B, basement",
    "Dark side of the Moon, sector 66",
];

const EXCUSES = [
    "Thought a light-year was a suggestion",
    "The autopilot was emotionally unavailable",
    "Was late for a wizard council",
    "Alien traffic jam near Jupiter",
    "Stuck in a localized time loop",
    "Cat walked on the hyper-drive keyboard",
    "Gravity failed on the way to work",
    "Accidentally reverse-engineered the parking brake",
    "Spacesuit needed an urgent iron-pressing",
    "Defending the galaxy from a minor inconvenience",
];

const AL_CATEGORIES = [
    "Dragon parts",
    "Potions",
    "Cursed antiques",
    "Rare flora",
    "Elemental essences",
    "Demon artifacts",
    "Alchemical metals",
    "Mystic scrolls",
    "Beast secretions",
    "Celestial debris",
];

const AL_SUB_CATEGORIES = [
    "Scales and claws",
    "Invisibility",
    "Shelf B-13",
    "Cauldron-ready",
    "Classified hazard",
    "Aged in crypts",
    "Banned by order",
    "Royal treasury",
    "Black market goods",
    "Experimental batch",
];

const AL_ADJECTIVES_1 = [
    "Shining",
    "Dark",
    "Ancient",
    "Boiling",
    "Icy",
    "Fizzy",
    "Glowing",
    "Rusty",
    "Crystal",
    "Venomous",
    "Phantom",
    "Golden",
    "Heavy",
    "Smoky",
    "Blazing",
];

const AL_ADJECTIVES_2 = [
    "galactic",
    "corrosive",
    "dense",
    "forgotten",
    "unstable",
    "mystical",
    "sticky",
    "radioactive",
    "resonant",
    "foggy",
    "crystalline",
    "draconic",
    "invisible",
    "fabled",
    "silent",
];

const AL_NOUNS = ["crystal", "goo", "powder", "extract", "infusion", "elixir", "ash", "monolith", "ingot", "balm", "shard", "mist", "gel", "dust", "symbol"];

function seeded(seed: number): number {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return value - Math.floor(value);
}

function pick<T>(values: readonly T[], seed: number): T {
    return values[Math.floor(seeded(seed) * values.length)];
}

function generateMinionName(index: number): string {
    const firstName = pick(FIRST_NAMES, index * 3 + 1);
    const lastName = pick(LAST_NAMES, index * 3 + 2);

    // Добавляем префикс в ~20% случаев
    const hasPrefix = seeded(index * 11 + 1) < 0.2;
    const prefix = hasPrefix ? `${pick(PREFIXES, index + 100)} ` : "";

    // Добавляем суффикс в ~30% случаев
    const hasSuffix = seeded(index * 11 + 2) < 0.3;
    const suffix = hasSuffix ? ` ${pick(SUFFIXES, index + 200)}` : "";

    return `${prefix}${firstName} ${lastName}${suffix}`;
}

function generatePilotName(index: number): string {
    const firstName = pick(FIRST_NAMES, index * 3 + 1);
    const lastName = pick(LAST_NAMES, index * 3 + 2);

    return `${firstName} ${lastName}`;
}

function createMinions(count: number): MinionRow[] {
    return Array.from({ length: count }, (_, index) => ({
        id: `${String(666 + index).padStart(3, "0")}-${String.fromCharCode(65 + (index % 26))}`,
        name: generateMinionName(index + 1),
        boss: pick(BOSSES, index + 2),
        specialty: pick(SPECIALTIES, index + 3),
        salaryGold: 700 + Math.floor(seeded(index + 4) * 2800),
        unionComplaints: Math.floor(seeded(index + 5) * 31),
        healthStatus: pick(HEALTH_STATUSES, index + 6),
        isAlive: seeded(index + 7) > 0.18,
    }));
}

function createSpeedingTickets(options: DatasetOptions = {}): SpeedingTicketRow[] {
    const offset = Math.max(0, options.offset ?? 0);
    const limit = Math.min(1000, Math.max(1, options.count ?? 100));

    return Array.from({ length: limit }, (_, index) => {
        const rowNumber = offset + index;
        return {
            ticketId: `TR-${String(994821 + rowNumber).padStart(6, "0")}`,
            pilotName: generatePilotName(rowNumber + 1),
            vehicleType: pick(VEHICLES, rowNumber + 2),
            sector: pick(SECTORS, rowNumber + 3),
            speedKmh: 500000 + Math.floor(seeded(rowNumber + 4) * 5000000),
            excuse: pick(EXCUSES, rowNumber + 5),
            fineCredits: 50000 + Math.floor(seeded(rowNumber + 6) * 950000),
        };
    });
}

function generateAlchemyItemName(index: number): string {
    const adj1 = pick(AL_ADJECTIVES_1, index * 7 + 1);
    const adj2 = pick(AL_ADJECTIVES_2, index * 7 + 2);
    const noun = pick(AL_NOUNS, index * 7 + 3);

    return `${adj1} ${adj2} ${noun}`;
}

function createAlchemyRows(count: number): AlchemyRow[] {
    return Array.from({ length: count }, (_, index) => {
        const stockQuantity = Math.floor(seeded(index + 8) * 50) + 1;
        const pricePerUnit = Math.round((50 + seeded(index + 9) * 2000) * 100) / 100;
        return {
            id: `ALC-${String(index + 1).padStart(4, "0")}`,
            category: pick(AL_CATEGORIES, index + 1),
            subCategory: pick(AL_SUB_CATEGORIES, index + 2),
            itemName: generateAlchemyItemName(index),
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

export async function getMinions(options: DatasetOptions): Promise<MinionRow[]> {
    const { count, delay } = options;

    await new Promise<void>((resolve) => setTimeout(resolve, delay ?? 0));

    return createMinions(count ?? 100);
}

export function useMinionsDS(options?: DatasetOptions): MinionRow[] {
    const [minions, setMinions] = useState<MinionRow[]>([]);

    useEffect(() => {
        getMinions(options ?? {}).then(setMinions);
    }, []);

    return minions;
}

export async function getSpeedingTickets(options: DatasetOptions): Promise<SpeedingTicketRow[]> {
    const { delay } = options;

    await new Promise<void>((resolve) => setTimeout(resolve, delay ?? 0));

    return createSpeedingTickets(options);
}

export function useSpeedingTicketsDS(options?: DatasetOptions): SpeedingTicketRow[] {
    const [speedingTickets, setSpeedingTickets] = useState<SpeedingTicketRow[]>([]);

    useEffect(() => {
        getSpeedingTickets(options ?? {}).then(setSpeedingTickets);
    }, []);

    return speedingTickets;
}

export async function getAlchemyRows(options: DatasetOptions): Promise<AlchemyRow[]> {
    const { count, delay } = options;

    await new Promise<void>((resolve) => setTimeout(resolve, delay ?? 0));

    return createAlchemyRows(count ?? 100);
}

export function useAlchemyDS(options?: DatasetOptions): AlchemyRow[] {
    const [alchemyRows, setAlchemyRows] = useState<AlchemyRow[]>([]);

    useEffect(() => {
        getAlchemyRows(options ?? {}).then(setAlchemyRows);
    }, []);

    return alchemyRows;
}

export async function getSuperweapon(delay?: number): Promise<SuperweaponNode> {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    return createSuperweapon();
}

export function useSuperweaponDS(delay?: number): SuperweaponNode {
    const [superweapon, setSuperweapon] = useState<SuperweaponNode>(createSuperweapon());

    useEffect(() => {
        getSuperweapon(delay).then(setSuperweapon);
    }, []);

    return superweapon;
}
