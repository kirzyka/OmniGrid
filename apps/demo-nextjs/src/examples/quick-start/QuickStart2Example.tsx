"use client";

import { useMemo } from "react";

import { MINIONS_DATASET } from "@/src/data/staticMinions";
import { MinionRow } from "@/src/data/types";
import { minionsSColDefs } from "@/src/examples/common/colDefs/minionsSColDefs";
import { OmniGrid } from "@omnigrid/react";
import { SelectionPlugin } from "@omnigrid/selection-plugin";
import { SortingPlugin } from "@omnigrid/sorting-plugin";

export function QuickStart2Example() {
    const sortingPlugin = useMemo(() => new SortingPlugin<MinionRow>(), []);
    const selectionPlugin = useMemo(
        () =>
            new SelectionPlugin<MinionRow>({
                mode: "multiple",
                showHeaderCheckbox: true,
                showRowCheckboxes: true,
            }),
        [],
    );

    return (
        <OmniGrid
            columns={minionsSColDefs}
            data={MINIONS_DATASET}
            getRowId={(row) => row.id}
            plugins={[sortingPlugin, selectionPlugin]}
            style={{ width: "100%" }}
        />
    );
}
