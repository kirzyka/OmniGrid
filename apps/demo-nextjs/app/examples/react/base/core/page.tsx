"use client";

import { ExampleShell } from "../../../../../src/components/example/ExampleShell";
import { CoreGridExample } from "../../../../../src/examples/core-grid/CoreGridExample";
import exampleSource from "../../../../../src/examples/core-grid/CoreGridExample.tsx?raw";
import gridConfigSource from "../../../../../src/components/GridConfigs.ts?raw";
import rendererSource from "../../../../../src/renderers/StatusRenderer.tsx?raw";

export default function CoreGridExamplePage() {
    return (
        <>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Core</p>
            <ExampleShell
                title="Start with the grid"
                description="The framework-agnostic core handles rows, columns, viewport state, and virtualization. The React adapter only needs your data and column definitions."
                sources={[
                    { label: "CoreGridExample.tsx", code: exampleSource },
                    { label: "GridConfigs.ts", code: gridConfigSource },
                    { label: "StatusRenderer.tsx", code: rendererSource },
                ]}
            >
                <CoreGridExample />
            </ExampleShell>
        </>
    );
}
