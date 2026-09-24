"use client";

import { useEffect, useMemo, useState } from "react";

import { getDemoDataset } from "@/src/data/dataService";
import { AlchemyRow } from "@/src/data/types";
import { ColumnDef, OmniGrid } from "@omnigrid/react";
import { SortingPlugin } from "@omnigrid/sorting-plugin";

const columns: ColumnDef<AlchemyRow>[] = [
    { id: "id", field: "id", header: "ID", width: 100 },
    { id: "category", field: "category", header: "Category", flex: 1, minWidth: 150, sortState: "asc" },
    { id: "subCategory", field: "subCategory", header: "Sub Category", flex: 1, minWidth: 150 },
    { id: "itemName", field: "itemName", header: "Item Name", flex: 1, minWidth: 150 },
    { id: "dangerLevel", field: "dangerLevel", header: "Danger Level", width: 150, align: "right" },
    { id: "stockQuantity", field: "stockQuantity", header: "Stock Quantity", width: 150, align: "right" },
    { id: "pricePerUnit", field: "pricePerUnit", header: "Price Per Unit", width: 130, align: "right" },
    { id: "totalValue", field: "totalValue", header: "Total Value", width: 130, align: "right" },
];

export function SortingGridExample() {
    const [data, setData] = useState<AlchemyRow[]>([]);
    const sortingPlugin = useMemo(() => new SortingPlugin<AlchemyRow>(), []);

    useEffect(() => {
        getDemoDataset("alchemy", { count: 500 }).then((data: any) => setData(data as AlchemyRow[]));
    }, []);

    return <OmniGrid columns={columns} data={data} plugins={[sortingPlugin]} rowOverscan={20} style={{ height: "100%", width: "100%" }} />;
}
