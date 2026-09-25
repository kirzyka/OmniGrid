"use client";

import { useState } from "react";

import { useMinionsDS } from "@/src/data/dataService";
import { minionsMColDefs } from "@/src/examples/common/colDefs/minionsMColDefs";
import { OmniGrid } from "@omnigrid/react";

import "./style/rowClassExample.css";

export function RowClassExample() {
    const data = useMinionsDS();
    const [datasetIndex, setDatasetIndex] = useState(0);
    const datasets = [data, [...data].reverse()];

    return (
        <div className="flex flex-col h-full">
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
            <div className="flex-1 min-h-0">
                <OmniGrid
                    columns={minionsMColDefs}
                    data={datasets[datasetIndex]}
                    getRowId={(row) => row.id}
                    rowClass="demo-row-class-sticky"
                    style={{ height: "100%", width: "100%" }}
                />
            </div>
        </div>
    );
}
