"use client";

import { useMemo } from "react";

import { type DemoRow, createDemoData } from "@/src/data/demoData";
import { DEMO_COLUMNS } from "@/src/examples/common/GridConfigs";
import { OmniGrid } from "@omnigrid/react";
import { SelectionPlugin } from "@omnigrid/selection-plugin";

export function UnselectableRowsExample() {
    const data = useMemo(createDemoData, []);
    const selectionPlugin = useMemo(
        () =>
            new SelectionPlugin<DemoRow>({
                mode: "multiple",
                showHeaderCheckbox: true,
                showRowCheckboxes: true,
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
