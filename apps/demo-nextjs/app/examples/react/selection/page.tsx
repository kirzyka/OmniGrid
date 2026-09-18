"use client";

import gridConfigSource from "../../../../src/components/GridConfigs.ts?raw";
import { ExampleShell } from "../../../../src/components/example/ExampleShell";
import { MultiSelectionGridExample } from "../../../../src/examples/selection/MultiSelectionGridExample";
import multiSelectionGridExampleSrc from "../../../../src/examples/selection/MultiSelectionGridExample.tsx?raw";
import { SingleSelectionGridExample } from "../../../../src/examples/selection/SingleSelectionGridExample";
import singleSelectionGridExampleSrc from "../../../../src/examples/selection/SingleSelectionGridExample?raw";

export default function SelectionExamplePage() {
    return (
        <>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Plugin / Selection</p>
            <ExampleShell
                title="Single selection"
                description="Use row click for single selection."
                sources={[
                    { label: "SingleSelectionGridExample.tsx", code: singleSelectionGridExampleSrc },
                    { label: "GridConfigs.ts", code: gridConfigSource },
                ]}
            >
                <SingleSelectionGridExample />
            </ExampleShell>
            <ExampleShell
                title="Multi selection"
                description="Use row clicks or click with 'Shift' key for multi selection."
                sources={[
                    { label: "SelectionGridExample.tsx", code: multiSelectionGridExampleSrc },
                    { label: "GridConfigs.ts", code: gridConfigSource },
                ]}
            >
                <MultiSelectionGridExample />
            </ExampleShell>
        </>
    );
}
