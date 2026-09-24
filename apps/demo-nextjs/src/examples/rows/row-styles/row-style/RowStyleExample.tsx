"use client";

import { useMinionsDS } from "@/src/data/dataService";
import { ROW_STYLES_EXAMPLE_COLUMNS } from "@/src/examples/rows/row-styles/rowStylesExampleColDefs";
import { OmniGrid } from "@omnigrid/react";

export function RowStyleExample() {
    const data = useMinionsDS();

    return (
        <OmniGrid
            columns={ROW_STYLES_EXAMPLE_COLUMNS}
            data={data}
            getRowId={(row) => row.id}
            rowStyle={{ backgroundColor: "rgba(5, 173, 152, 0.10)" }}
            style={{ height: "100%", width: "100%" }}
        />
    );
}
