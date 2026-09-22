"use client";

import { ExampleShell } from "@/src/components/ui/example/ExampleShell";
import { SortingGridExample } from "@/src/examples/plugins/base/sorting/SortingGridExample";
import exampleSource from "@/src/examples/plugins/base/sorting/SortingGridExample.tsx?raw";

export default function SortingExamplePage() {
    return (
        <>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Plugin / Sorting</p>
            <ExampleShell
                title="Add sorting as a plugin"
                description="Plugins extend the grid without changing your rendering surface. Add the sorting plugin, then click any sortable column header in the table."
                sources={[{ label: "SortingGridExample.tsx", code: exampleSource }]}
            >
                <SortingGridExample />
            </ExampleShell>
        </>
    );
}
