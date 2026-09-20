"use client";

import { MINIONS_DATASET } from "@/src/data/staticMinions";
import { OmniGrid } from "@omnigrid/react";

import { quickStartColumnDefs } from "./quickStartColumnDefs";

export function QuickStart1Example() {
    return <OmniGrid columns={quickStartColumnDefs} data={MINIONS_DATASET} style={{ width: "100%" }} />;
}
