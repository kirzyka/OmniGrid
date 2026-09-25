"use client";

import { useMinionsDS } from "@/src/data/dataService";
import { MinionRow } from "@/src/data/types";
import { minionsMColDefs } from "@/src/examples/common/colDefs/minionsMColDefs";
import { OmniGrid, RowRenderParams } from "@omnigrid/react";

import "./getRowStyleExample.css";

export function GetRowStyleExample() {
    const data = useMinionsDS();

    return (
        <OmniGrid
            columns={minionsMColDefs}
            data={data}
            getRowId={(row: MinionRow) => row.id}
            getRowStyle={({ data }: RowRenderParams<MinionRow>) => {
                if (data.healthStatus === "healthy") return { backgroundColor: "rgba(5, 173, 152, 0.10)" };
                return undefined;
            }}
            style={{ height: "100%", width: "100%" }}
        />
    );
}
