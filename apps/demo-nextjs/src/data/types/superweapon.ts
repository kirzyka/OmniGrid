export interface SuperweaponNode {
    id: string;
    name: string;
    componentType: "station" | "system" | "module" | "part";
    status: "operational" | "under-construction" | "needs-repair";
    owner: string;
    powerLevel: number;
    children?: SuperweaponNode[];
}
