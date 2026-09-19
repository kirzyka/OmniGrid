"use client";

import { ExampleShell } from "@/src/components/ui/example/ExampleShell";
import gridConfigSource from "@/src/examples/common/GridConfigs.ts?raw";
import { CheckboxSelectionGridExample } from "@/src/examples/plugins/base/selection/CheckboxSelectionGridExample";
import checkboxSelectionGridExampleSrc from "@/src/examples/plugins/base/selection/CheckboxSelectionGridExample.tsx?raw";
import { MultiSelectionGridExample } from "@/src/examples/plugins/base/selection/MultiSelectionGridExample";
import multiSelectionGridExampleSrc from "@/src/examples/plugins/base/selection/MultiSelectionGridExample.tsx?raw";
import { SingleSelectionGridExample } from "@/src/examples/plugins/base/selection/SingleSelectionGridExample";
import singleSelectionGridExampleSrc from "@/src/examples/plugins/base/selection/SingleSelectionGridExample?raw";
import { UnselectableRowsExample } from "@/src/examples/plugins/base/selection/UnselectableRowsExample";
import unselectableRowsExampleSrc from "@/src/examples/plugins/base/selection/UnselectableRowsExample.tsx?raw";

export default function SelectionExamplePage() {
    return (
        <>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Plugin / Selection</p>
            <ExampleShell
                id="single-selection"
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
                id="multi-selection"
                title="Multi selection"
                description="Use row clicks or click with 'Shift' key for multi selection."
                sources={[
                    { label: "SelectionGridExample.tsx", code: multiSelectionGridExampleSrc },
                    { label: "GridConfigs.ts", code: gridConfigSource },
                ]}
            >
                <MultiSelectionGridExample />
            </ExampleShell>
            <ExampleShell
                id="checkbox-selection"
                title="Checkbox selection"
                description="Use row clicks or checkbox for multi selection."
                sources={[
                    { label: "CheckboxSelectionGridExample.tsx", code: checkboxSelectionGridExampleSrc },
                    { label: "GridConfigs.ts", code: gridConfigSource },
                ]}
            >
                <CheckboxSelectionGridExample />
            </ExampleShell>
            <ExampleShell
                id="unselectable-rows"
                title="Unselectable rows"
                description="Use isRowSelectable function to prevent row selection."
                sources={[
                    { label: "UnselectableRowsExample.tsx", code: unselectableRowsExampleSrc },
                    { label: "GridConfigs.ts", code: gridConfigSource },
                ]}
            >
                <UnselectableRowsExample />
            </ExampleShell>
        </>
    );
}
