"use client";

import { useMinionsDS } from "@/src/data/dataService";
import { minionsSColDefs } from "@/src/examples/common/colDefs/minionsSColDefs";
import { OmniGrid } from "@omnigrid/react";

export function NoRowHoverExample() {
    const data = useMinionsDS();

    return <OmniGrid columns={minionsSColDefs} data={data} suppressRowHoverHighlight style={{ height: "100%", width: "100%" }} />;
}
