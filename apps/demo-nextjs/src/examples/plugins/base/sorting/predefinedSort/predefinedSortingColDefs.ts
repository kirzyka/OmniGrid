import { AlchemyRow } from "@/src/data/types";
import { DangerLevelRenderer } from "@/src/examples/common/renderers/DangerLevelRenderer";
import { ColumnDef } from "@omnigrid/react";

export const predefinedSortingColDefs: ColumnDef<AlchemyRow>[] = [
    { id: "id", field: "id", header: "ID", width: 100 },
    { id: "category", field: "category", header: "Category", flex: 1, minWidth: 150, sortState: "asc" },
    { id: "subCategory", field: "subCategory", header: "Sub Category", flex: 1, minWidth: 150 },
    { id: "itemName", field: "itemName", header: "Item Name", flex: 1, minWidth: 150 },
    { id: "dangerLevel", field: "dangerLevel", header: "Danger Level", width: 150, cellRenderer: DangerLevelRenderer },
    { id: "stockQuantity", field: "stockQuantity", header: "Qty.", width: 60, align: "right" },
    {
        id: "pricePerUnit",
        field: "pricePerUnit",
        header: "Price Per Unit",
        width: 130,
        align: "right",
        valueFormatter: (value: unknown) => (typeof value === "number" ? `$ ${value.toFixed(2)}` : String(value ?? "")),
    },
    {
        id: "totalValue",
        field: "totalValue",
        header: "Total Value",
        width: 130,
        align: "right",
        valueFormatter: (value: unknown) => (typeof value === "number" ? `$ ${value.toFixed(2)}` : String(value ?? "")),
    },
];
