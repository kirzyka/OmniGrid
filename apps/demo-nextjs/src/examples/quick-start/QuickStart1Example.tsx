"use client";

import { MINIONS_DATASET } from "@/src/data/staticMinions";
import { minionsSColDefs } from "@/src/examples/common/colDefs/minionsSColDefs";
import { OmniGrid } from "@omnigrid/react";

export function QuickStart1Example() {
    return <OmniGrid columns={minionsSColDefs} data={MINIONS_DATASET} style={{ width: "100%" }} />;
}
