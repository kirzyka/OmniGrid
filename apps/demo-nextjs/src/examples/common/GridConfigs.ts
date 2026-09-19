import type { DemoRow } from "@/src/data/demoData";
import { StatusRenderer } from "@/src/examples/common/renderers/StatusRenderer";
import type { ColumnDef } from "@omnigrid/react";

export const DEMO_COLUMNS: ColumnDef<DemoRow>[] = [
    { id: "id", field: "id", header: "ID", width: 55 },
    { id: "name", field: "name", header: "Name", flex: 2, width: 180, sortable: false },
    { id: "email", field: "email", header: "Email", flex: 1, minWidth: 150 },
    { id: "city", field: "city", header: "City", width: 140 },
    { id: "status", field: "status", header: "Status", width: 120, cellRenderer: StatusRenderer },
    {
        id: "amount",
        field: "amount",
        header: "Amount",
        width: 110,
        valueFormatter: (value: unknown) => (typeof value === "number" ? `$${value.toFixed(2)}` : String(value ?? "")),
    },
    { id: "quantity", field: "quantity", header: "Qty", width: 80 },
    { id: "createdAt", field: "createdAt", header: "Created", width: 120 },
];
