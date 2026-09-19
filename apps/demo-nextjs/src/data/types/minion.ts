export type MinionHealthStatus = "healthy" | "partially-frogified" | "on-leave" | "missing";

export interface MinionRow {
    id: string;
    name: string;
    boss: string;
    specialty: string;
    salaryGold: number;
    unionComplaints: number;
    healthStatus: MinionHealthStatus;
    isAlive: boolean;
}
