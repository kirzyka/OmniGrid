"use client";

import { useMemo } from "react";

import { OmniGrid } from "@omnigrid/react";
import { SelectionPlugin } from "@omnigrid/selection-plugin";

import { DEMO_COLUMNS } from "../../components/GridConfigs";
import { type DemoRow, createDemoData } from "../../data/demoData";

export function MultiSelectionGridExample() {
    const data = useMemo(createDemoData, []);
    const selectionPlugin = useMemo(
        () =>
            new SelectionPlugin<DemoRow>({
                mode: "multiple",
                isRowSelectable: (row) => row.status !== "archived",
            }),
        [],
    );

    return (
        <OmniGrid
            columns={DEMO_COLUMNS}
            data={data}
            getRowId={(row) => row.id}
            plugins={[selectionPlugin]}
            style={{ height: "100%", width: "100%" }}
        />
    );
}
