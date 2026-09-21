"use client";

import { use } from "react";

import { MinionRow } from "@/src/data/types";
import { ROW_STYLES_EXAMPLE_COLUMNS } from "@/src/examples/rows/row-styles/rowStylesExampleColDefs";
import { OmniGrid, RowRenderParams } from "@omnigrid/react";

import "./getRowClassExample.css";

interface Props {
    dataPromise: Promise<MinionRow[]>;
}

export function GetRowClassExample({ dataPromise }: Props) {
    const data = use(dataPromise);

    return (
        <OmniGrid
            columns={ROW_STYLES_EXAMPLE_COLUMNS}
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