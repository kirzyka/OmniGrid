"use client";

import { ExampleShell } from "@/src/components/ui/example/ExampleShell";
import speedTicketsMColDefsSource from "@/src/examples/common/colDefs/speedTicketsMColDefs.ts?raw";
import { CoreGridExample } from "@/src/examples/core-grid/CoreGridExample";
import exampleSource from "@/src/examples/core-grid/CoreGridExample.tsx?raw";

export default function CoreGridExamplePage() {
    return (
        <>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Core</p>
            <ExampleShell
                title="Start with the grid"
                description="The framework-agnostic core handles rows, columns, viewport state, and virtualization. The React adapter only needs your data and column definitions."
                sources={[
                    { label: "CoreGridExample.tsx", code: exampleSource },
                    { label: "speedTicketsMColDefs.ts", code: speedTicketsMColDefsSource },
                ]}
            >
                <CoreGridExample />
            </ExampleShell>
        </>
    );
}
