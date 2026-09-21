"use client";

import { use } from "react";

import { MinionRow } from "@/src/data/types";
import { ROW_STYLES_EXAMPLE_COLUMNS } from "@/src/examples/rows/row-styles/rowStylesExampleColDefs";
import { OmniGrid, RowRenderParams } from "@omnigrid/react";

import "./getRowStyleExample.css";

interface Props {
    dataPromise: Promise<MinionRow[]>;
}

export function GetRowStyleExample({ dataPromise }: Props) {
    const data = use(dataPromise);

    return (
        <OmniGrid
            columns={ROW_STYLES_EXAMPLE_COLUMNS}
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
