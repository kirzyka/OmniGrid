"use client";

import { useMemo } from "react";

import { useAlchemyDS } from "@/src/data/dataService";
import { AlchemyRow } from "@/src/data/types";
import { alchemyMColDefs } from "@/src/examples/common/colDefs/alchemyMColDefs";
import { OmniGrid } from "@omnigrid/react";
import { SelectionPlugin } from "@omnigrid/selection-plugin";

export function CheckboxSelectionGridExample() {
    const data = useAlchemyDS();
    const selectionPlugin = useMemo(
        () =>
            new SelectionPlugin<AlchemyRow>({
                mode: "multiple",
                showRowCheckboxes: true,
                showHeaderCheckbox: true,
            }),
        [],
    );

    return <OmniGrid columns={alchemyMColDefs} data={data} getRowId={(row) => row.id} plugins={[selectionPlugin]} style={{ height: "100%", width: "100%" }} />;
}
