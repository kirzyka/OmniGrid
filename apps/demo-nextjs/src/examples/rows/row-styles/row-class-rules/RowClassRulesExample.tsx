"use client";

import { useState } from "react";

import { useMinionsDS } from "@/src/data/dataService";
import { MinionRow } from "@/src/data/types";
import { minionsMColDefs } from "@/src/examples/common/colDefs/minionsMColDefs";
import { OmniGrid, type RowClassRules } from "@omnigrid/react";

import "./style/rowClassRulesExample.css";

export function RowClassRulesExample() {
    const data = useMinionsDS();
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
                <div className="flex-1 min-h-0">
                    <OmniGrid
                        columns={minionsMColDefs}
                        data={data}
                        getRowId={(row: MinionRow) => row.id}
                        rowClassRules={rowClassRules}
                        style={{ height: "100%", width: "100%" }}
                    />
                </div>
            </div>
        </>
    );
}
