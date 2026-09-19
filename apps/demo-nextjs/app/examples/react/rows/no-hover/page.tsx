"use client";

import { ExampleShell } from "@/src/components/ui/example/ExampleShell";
import gridConfigSource from "@/src/examples/common/GridConfigs.ts?raw";
import { NoRowHoverExample } from "@/src/examples/rows/no-hover/NoRowHoverExample";
import exampleSource from "@/src/examples/rows/no-hover/NoRowHoverExample.tsx?raw";

export default function NoRowHoverExamplePage() {
    return (
        <>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Base</p>
            <ExampleShell
                title="Disable row hover highlight"
                description="Set rowHoverHighlight={false} to turn off the hover background on rows and cells. All grid behavior stays the same — only the hover tint disappears."
                sources={[
                    { label: "NoRowHoverExample.tsx", code: exampleSource },
                    { label: "GridConfigs.ts", code: gridConfigSource },
                ]}
            >
                <NoRowHoverExample />
            </ExampleShell>
        </>
    );
}
