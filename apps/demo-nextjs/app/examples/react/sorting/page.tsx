"use client";

import { ExampleShell } from "../../../../src/components/ExampleShell";
import gridConfigSource from "../../../../src/components/GridConfigs.ts?raw";
import { SortingGridExample } from "../../../../src/examples/sorting/SortingGridExample";
import exampleSource from "../../../../src/examples/sorting/SortingGridExample.tsx?raw";

export default function SortingExamplePage() {
    return (
        <ExampleShell
            eyebrow="Example 02 / Plugin"
            title="Add sorting as a plugin"
            description="Plugins extend the grid without changing your rendering surface. Add the sorting plugin, then click any sortable column header in the table."
            sources={[
                { label: "SortingGridExample.tsx", code: exampleSource },
                { label: "GridConfigs.ts", code: gridConfigSource },
            ]}
        >
            <SortingGridExample />
        </ExampleShell>
    );
}
