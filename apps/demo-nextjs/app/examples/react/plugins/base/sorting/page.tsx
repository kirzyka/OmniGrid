"use client";

import { ExampleShell } from "@/src/components/ui/example/ExampleShell";
import { SortingGridExample } from "@/src/examples/plugins/base/sorting/SortingGridExample";
import exampleSource from "@/src/examples/plugins/base/sorting/SortingGridExample.tsx?raw";
import { PredefinedSortingGridExample } from "@/src/examples/plugins/base/sorting/predefinedSort/PredefinedSortingGridExample";
import PredefinedSortingGridExampleSource from "@/src/examples/plugins/base/sorting/predefinedSort/PredefinedSortingGridExample.tsx?raw";
import predefinedSortinColDefsSource from "@/src/examples/plugins/base/sorting/predefinedSort/predefinedSortingColDefs.ts?raw";

export default function SortingExamplePage() {
    return (
        <>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Plugin / Sorting</p>
            <ExampleShell
                title="Simple sorting"
                description="Click a column header to sort by that column. Use click + Ctrl to sort multiple columns."
                sources={[{ label: "SortingGridExample.tsx", code: exampleSource }]}
            >
                <SortingGridExample />
            </ExampleShell>
            <ExampleShell
                title="Predefined sorting"
                description={
                    <span>
                        Use the <b>sortState</b> prop to sort by a specific column.
                    </span>
                }
                sources={[
                    { label: "PredefinedSortingGridExample.tsx", code: PredefinedSortingGridExampleSource },
                    { label: "predefinedSortingColDefs.ts", code: predefinedSortinColDefsSource },
                ]}
            >
                <PredefinedSortingGridExample />
            </ExampleShell>
        </>
    );
}
