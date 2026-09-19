"use client";

import { useMemo } from "react";

import { type DemoRow, createDemoData } from "@/src/data/demoData";
import { DEMO_COLUMNS } from "@/src/examples/common/GridConfigs";
import { OmniGrid } from "@omnigrid/react";
import { SortingPlugin } from "@omnigrid/sorting-plugin";

export function SortingGridExample() {
    const data = useMemo(createDemoData, []);
    const sortingPlugin = useMemo(() => new SortingPlugin<DemoRow>(), []);

    return (
        <OmniGrid
            columns={DEMO_COLUMNS}
            data={data}
            plugins={[sortingPlugin]}
            style={{ height: "100%", width: "100%" }}
        />
    );
}
