"use client";

import { useMemo } from "react";

import { OmniGrid } from "@omnigrid/react";
import { SortingPlugin } from "@omnigrid/sorting-plugin";

import { DEMO_COLUMNS } from "../../components/GridConfigs";
import { type DemoRow, createDemoData } from "../../data/demoData";

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
