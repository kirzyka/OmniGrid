"use client";

import { useMemo } from "react";

import { ExampleShell } from "@/src/components/ui/example/ExampleShell";
import { getMinions } from "@/src/data/dataService";
import type { MinionRow } from "@/src/data/types";
import { GetRowClassExample } from "@/src/examples/rows/row-styles/get-row-class/GetRowClassExample";
import getRowClassExampleSource from "@/src/examples/rows/row-styles/get-row-class/GetRowClassExample.tsx?raw";
import { GetRowStyleExample } from "@/src/examples/rows/row-styles/get-row-style/GetRowStyleExample";
import getRowStyleExampleSource from "@/src/examples/rows/row-styles/get-row-style/GetRowStyleExample.tsx?raw";
import { RowClassRulesExample } from "@/src/examples/rows/row-styles/row-class-rules/RowClassRulesExample";
import rowClassRulesExampleSource from "@/src/examples/rows/row-styles/row-class-rules/RowClassRulesExample.tsx?raw";
import { RowClassExample } from "@/src/examples/rows/row-styles/row-class/RowClassExample";
import rowClassExampleSource from "@/src/examples/rows/row-styles/row-class/RowClassExample.tsx?raw";
import { RowStyleExample } from "@/src/examples/rows/row-styles/row-style/RowStyleExample";
import rowStyleExampleSource from "@/src/examples/rows/row-styles/row-style/RowStyleExample.tsx?raw";
import rowStylesExampleColDefsSource from "@/src/examples/rows/row-styles/rowStylesExampleColDefs?raw";

export default function RowStyleExamplePage() {
    const data = useMemo(() => getMinions({ count: 100 }), []) as Promise<MinionRow[]>;

    return (
        <>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Base</p>
            <ExampleShell
                id="row-style"
                title="Row style"
                description="rowStyle provides a CSS style object that is applied individually to each row element. It is a static style — use rowClassRules for dynamic per-row styling."
                sources={[
                    { label: "RowStyleExample.tsx", code: rowStyleExampleSource },
                    { label: "rowStylesExampleColDefs.ts", code: rowStylesExampleColDefsSource },
                ]}
            >
                <RowStyleExample />
            </ExampleShell>
            <ExampleShell
                id="get-row-style"
                title="Get row style"
                description="getRowStyle function provides a CSS style object that is applied individually to each row element."
                sources={[
                    { label: "GetRowStyleExample.tsx", code: getRowStyleExampleSource },
                    { label: "rowStylesExampleColDefs.ts", code: rowStylesExampleColDefsSource },
                ]}
            >
                <GetRowStyleExample dataPromise={data} />
            </ExampleShell>
            <ExampleShell
                id="row-class"
                title="Row class"
                description="rowClass applies a CSS class to every row. The class is not removed when the data is refreshed — try the Refresh data button and watch the styling stay in place."
                sources={[
                    { label: "RowClassExample.tsx", code: rowClassExampleSource },
                    { label: "rowStylesExampleColDefs.ts", code: rowStylesExampleColDefsSource },
                ]}
            >
                <RowClassExample dataPromise={data} />
            </ExampleShell>
            <ExampleShell
                id="get-row-class"
                title="Get row class"
                description="getRowClass function returns CSS class(es) for each row. Classes are applied dynamically on every render."
                sources={[
                    { label: "GetRowClassExample.tsx", code: getRowClassExampleSource },
                    { label: "rowStylesExampleColDefs.ts", code: rowStylesExampleColDefsSource },
                ]}
            >
                <GetRowClassExample dataPromise={data} />
            </ExampleShell>
            <ExampleShell
                id="row-class-rules"
                title="Row class rules"
                description="rowClassRules maps rule names to predicates. Every row whose predicate returns true gets the rule name applied as a CSS class. Rules are dynamic and applied in batches — toggle the high-value rule and all visible rows update in a single pass."
                sources={[
                    { label: "RowClassRulesExample.tsx", code: rowClassRulesExampleSource },
                    { label: "rowStylesExampleColDefs.ts", code: rowStylesExampleColDefsSource },
                ]}
            >
                <RowClassRulesExample dataPromise={data} />
            </ExampleShell>
        </>
    );
}
