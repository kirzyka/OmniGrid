"use client";

import { use, useState } from "react";

import { MinionRow } from "@/src/data/types";
import { ROW_STYLES_EXAMPLE_COLUMNS } from "@/src/examples/rows/row-styles/rowStylesExampleColDefs";
import { OmniGrid } from "@omnigrid/react";

import "./style/rowClassExample.css";

interface Props {
    dataPromise: Promise<MinionRow[]>;
}

export function RowClassExample({ dataPromise }: Props) {
    const data = use(dataPromise);
    const [datasetIndex, setDatasetIndex] = useState(0);
    const datasets = [data, [...data].reverse()];

    return (
        <>
            <div className="flex flex-col">
                <div className="flex items-center gap-3 p-2">
                    <button
                        type="button"
                        className="cursor-pointer border border-mint bg-transparent px-4 py-2 font-sans text-xs text-mint hover:bg-mint hover:text-white"
                        onClick={() => setDatasetIndex((datasetIndex + 1) % datasets.length)}
                    >
                        Refresh data
                    </button>
                    <span className="font-sans text-xs text-ink dark:text-ink-dark">Row class stays applied after a data refresh.</span>
                </div>
                <OmniGrid
                    columns={ROW_STYLES_EXAMPLE_COLUMNS}
                    data={datasets[datasetIndex]}
                    getRowId={(row) => row.id}
                    rowClass="demo-row-class-sticky"
                    style={{ height: "340px", width: "100%" }}
                />
            </div>
        </>
    );
}
