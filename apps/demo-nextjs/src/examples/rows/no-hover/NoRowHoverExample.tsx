"use client";

import { useMemo } from "react";

import { createDemoData } from "@/src/data/demoData";
import { DEMO_COLUMNS } from "@/src/examples/common/GridConfigs";
import { OmniGrid } from "@omnigrid/react";

export function NoRowHoverExample() {
    const data = useMemo(createDemoData, []);

    return (
        <OmniGrid
            columns={DEMO_COLUMNS}
            data={data}
            suppressRowHoverHighlight
            style={{ height: "100%", width: "100%" }}
        />
    );
}
