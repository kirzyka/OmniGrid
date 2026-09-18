"use client";

import { ExampleShell } from "../../../../src/components/ExampleShell";
import gridConfigSource from "../../../../src/components/GridConfigs.ts?raw";
import { CoreGridExample } from "../../../../src/examples/core-grid/CoreGridExample";
import exampleSource from "../../../../src/examples/core-grid/CoreGridExample.tsx?raw";
import rendererSource from "../../../../src/renderers/StatusRenderer.tsx?raw";

export default function CoreGridExamplePage() {
    return (
        <ExampleShell
            eyebrow="Example 01 / Core"
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
    );
}
