"use client";

import { useMemo } from "react";

import { useAlchemyDS } from "@/src/data/dataService";
import { AlchemyRow } from "@/src/data/types";
import { alchemyMColDefs } from "@/src/examples/common/colDefs/alchemyMColDefs";
import { OmniGrid } from "@omnigrid/react";
import { SelectionPlugin } from "@omnigrid/selection-plugin";
import { SortingPlugin } from "@omnigrid/sorting-plugin";

export function LandingDemo() {
    const data = useAlchemyDS({ count: 1000 });
    const sortingPlugin = useMemo(() => new SortingPlugin<AlchemyRow>(), []);
    const selectionPlugin = useMemo(
        () =>
            new SelectionPlugin<AlchemyRow>({
                mode: "multiple",
            }),
        [],
    );

    return (
        <div className="border border-slate bg-paper dark:border-slate-dark dark:bg-paper-dark">
            <div className="flex items-center justify-between border-b border-slate px-4 py-[13px] font-sans text-[11px] uppercase dark:border-slate-dark">
                <span>
                    <i className="mr-[7px] inline-block size-[7px] rounded-full bg-mint dark:bg-mint-dark" /> Live dataset
                </span>
                <span>
                    {data.length.toLocaleString("en-US")} rows <b>·</b> {alchemyMColDefs.length} columns
                </span>
            </div>
            <div className="h-[420px] sm:h-[540px]">
                <OmniGrid columns={alchemyMColDefs} data={data} plugins={[sortingPlugin, selectionPlugin]} style={{ height: "100%", width: "100%" }} />
            </div>
        </div>
    );
}
