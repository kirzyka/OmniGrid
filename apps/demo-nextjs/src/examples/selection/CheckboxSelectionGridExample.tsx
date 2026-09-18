"use client";

import { useMemo } from "react";

import { OmniGrid } from "@omnigrid/react";
import { SelectionPlugin } from "@omnigrid/selection-plugin";

import { DEMO_COLUMNS } from "../../components/GridConfigs";
import { type DemoRow, createDemoData } from "../../data/demoData";

export function CheckboxSelectionGridExample() {
    const data = useMemo(createDemoData, []);
    const selectionPlugin = useMemo(
        () =>
            new SelectionPlugin<DemoRow>({
                mode: "multiple",
                showRowCheckboxes: true,
                showHeaderCheckbox: true,
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
