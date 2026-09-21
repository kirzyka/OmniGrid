"use client";

import { use, useState } from "react";

import { MinionRow } from "@/src/data/types";
import { ROW_STYLES_EXAMPLE_COLUMNS } from "@/src/examples/rows/row-styles/rowStylesExampleColDefs";
import { OmniGrid, type RowClassRules } from "@omnigrid/react";

import "./style/rowClassRulesExample.css";

interface Props {
    dataPromise: Promise<MinionRow[]>;
}

export function RowClassRulesExample({ dataPromise }: Props) {
    const data = use(dataPromise);
    const [highlightHighSalary, setHighlightHighSalary] = useState(false);

    const rowClassRules: RowClassRules<MinionRow> = {
        "demo-row-high-value": ({ data }) => highlightHighSalary && data.salaryGold >= 3000,
        "demo-row-complainer": ({ data }) => data.unionComplaints >= 20,
        "demo-row-frogified": ({ data }) => data.healthStatus === "partially-frogified",
    };

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 p-2">
                    <button
                        type="button"
                        className="cursor-pointer border border-mint bg-transparent px-4 py-2 font-sans text-xs text-mint hover:bg-mint hover:text-white"
                        onClick={() => setHighlightHighSalary(!highlightHighSalary)}
                    >
                        {highlightHighSalary ? "Disable" : "Enable"} high-salary rule
                    </button>
                    <span className="font-sans text-xs text-ink dark:text-ink-dark">
                        Rules re-evaluate and apply in a single batch across all visible rows.
                    </span>
                </div>
                <OmniGrid
                    columns={ROW_STYLES_EXAMPLE_COLUMNS}
                    data={data}
                    getRowId={(row: MinionRow) => row.id}
                    rowClassRules={rowClassRules}
                    style={{ height: "100%", width: "100%" }}
                />
            </div>
        </>
    );
}
