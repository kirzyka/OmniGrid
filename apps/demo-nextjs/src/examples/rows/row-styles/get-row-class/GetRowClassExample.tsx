"use client";

import { useMinionsDS } from "@/src/data/dataService";
import { MinionRow } from "@/src/data/types";
import { minionsMColDefs } from "@/src/examples/common/colDefs/minionsMColDefs";
import { OmniGrid, RowRenderParams } from "@omnigrid/react";

import "./getRowClassExample.css";

export function GetRowClassExample() {
    const data = useMinionsDS();

    return (
        <OmniGrid
            columns={minionsMColDefs}
            data={data}
            getRowId={(row: MinionRow) => row.id}
            getRowClass={({ data }: RowRenderParams<MinionRow>) => {
                if (data.salaryGold >= 3000) return "demo-row-high-salary";
                if (data.unionComplaints >= 20) return "demo-row-complainer";
                return undefined;
            }}
            style={{ height: "100%", width: "100%" }}
        />
    );
}
