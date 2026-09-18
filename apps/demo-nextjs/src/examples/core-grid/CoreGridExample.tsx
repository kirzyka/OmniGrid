"use client";

import { useMemo } from "react";

import { OmniGrid } from "@omnigrid/react";

import { DEMO_COLUMNS } from "../../components/GridConfigs";
import { createDemoData } from "../../data/demoData";

export function CoreGridExample() {
    const data = useMemo(createDemoData, []);

    return <OmniGrid columns={DEMO_COLUMNS} data={data} style={{ height: "100%", width: "100%" }} />;
}
