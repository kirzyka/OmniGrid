import type { MinionRow } from "./types";

export const MINIONS_DATASET: MinionRow[] = [
    {
        id: "666-B",
        name: "Goblin Bob",
        boss: "Lord Darkmorth",
        specialty: "Laser calibration",
        salaryGold: 1500,
        unionComplaints: 14,
        healthStatus: "partially-frogified",
        isAlive: false,
    },
    {
        id: "007-X",
        name: "Doom Susan",
        boss: "The Overlord",
        specialty: "Villain monologues",
        salaryGold: 2300,
        unionComplaints: 3,
        healthStatus: "healthy",
        isAlive: true,
    },
    {
        id: "404-C",
        name: "Muffin Golem",
        boss: "Lord Darkmorth",
        specialty: "Inbox triage",
        salaryGold: 980,
        unionComplaints: 27,
        healthStatus: "on-leave",
        isAlive: true,
    },
];
