"use client";

import { useMinionsDS } from "@/src/data/dataService";
import { minionsMColDefs } from "@/src/examples/common/colDefs/minionsMColDefs";
import { OmniGrid } from "@omnigrid/react";

export function RowStyleExample() {
    const data = useMinionsDS();

    return (
        <OmniGrid
            columns={minionsMColDefs}
            data={data}
            getRowId={(row) => row.id}
            rowStyle={{ backgroundColor: "rgba(5, 173, 152, 0.10)" }}
            style={{ height: "100%", width: "100%" }}
        />
    );
}
