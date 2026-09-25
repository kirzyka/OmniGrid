"use client";

import { useMemo } from "react";

import { useAlchemyDS } from "@/src/data/dataService";
import { AlchemyRow } from "@/src/data/types";
import { predefinedSortingColDefs } from "@/src/examples/plugins/base/sorting/predefinedSort/predefinedSortingColDefs";
import { OmniGrid } from "@omnigrid/react";
import { SortingPlugin } from "@omnigrid/sorting-plugin";

export function PredefinedSortingGridExample() {
    const data = useAlchemyDS();
    const sortingPlugin = useMemo(() => new SortingPlugin<AlchemyRow>(), []);

    return <OmniGrid columns={predefinedSortingColDefs} data={data} plugins={[sortingPlugin]} rowOverscan={20} style={{ height: "100%", width: "100%" }} />;
}
