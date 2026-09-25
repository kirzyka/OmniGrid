import { MinionRow } from "@/src/data/types";
import { ColumnDef } from "@omnigrid/react";

export const minionsSColDefs: ColumnDef<MinionRow>[] = [
    { id: "name", field: "name", header: "Name", flex: 1, minWidth: 150 },
    { id: "boss", field: "boss", header: "Boss", flex: 1, minWidth: 150 },
    { id: "specialty", field: "specialty", header: "Specialty", flex: 1, minWidth: 150 },
    {
        id: "salaryGold",
        field: "salaryGold",
        header: "Salary",
        align: "right",
        width: 130,
    },
];
