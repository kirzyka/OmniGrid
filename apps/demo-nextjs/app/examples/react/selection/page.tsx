"use client";

import { ExampleShell } from "../../../../src/components/ExampleShell";
import gridConfigSource from "../../../../src/components/GridConfigs.ts?raw";
import { SelectionGridExample } from "../../../../src/examples/selection/SelectionGridExample";
import exampleSource from "../../../../src/examples/selection/SelectionGridExample.tsx?raw";

export default function SelectionExamplePage() {
    return (
        <ExampleShell
            eyebrow="Example 03 / Plugin"
            title="Select rows with a plugin"
            description="Use row clicks, checkboxes, select-all, and shift ranges while keeping selection rules in a reusable plugin."
            sources={[
                { label: "SelectionGridExample.tsx", code: exampleSource },
                { label: "GridConfigs.ts", code: gridConfigSource },
            ]}
        >
            <SelectionGridExample />
        </ExampleShell>
    );
}
