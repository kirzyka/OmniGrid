"use client";

import { ExampleShell } from "@/src/components/ui/example/ExampleShell";
import minionsMColDefsSource from "@/src/examples/common/colDefs/minionsMColDefs.ts?raw";
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

export default function RowStyleExamplePage() {
    return (
        <>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Base</p>
            <ExampleShell
                id="row-style"
                title="Row style"
                description={
                    <span>
                        <b>rowStyle</b> provides a CSS style object that is applied individually to each row element. It is a static style — use{" "}
                        <b>rowClassRules</b>&nbsp; for dynamic per-row styling.
                    </span>
                }
                sources={[
                    { label: "RowStyleExample.tsx", code: rowStyleExampleSource },
                    { label: "minionsMiddleColDefsSource.ts", code: minionsMColDefsSource },
                ]}
            >
                <RowStyleExample />
            </ExampleShell>
            <ExampleShell
                id="get-row-style"
                title="Get row style"
                description={
                    <span>
                        <b>getRowStyle</b> function provides a CSS style object that is applied individually to each row element.
                    </span>
                }
                sources={[
                    { label: "GetRowStyleExample.tsx", code: getRowStyleExampleSource },
                    { label: "minionsMiddleColDefsSource.ts", code: minionsMColDefsSource },
                ]}
            >
                <GetRowStyleExample />
            </ExampleShell>
            <ExampleShell
                id="row-class"
                title="Row class"
                description={
                    <span>
                        <b>rowClass</b> applies a CSS class to every row. The class is not removed when the data is refreshed — try the Refresh data button and
                        watch the styling stay in place.
                    </span>
                }
                sources={[
                    { label: "RowClassExample.tsx", code: rowClassExampleSource },
                    { label: "minionsMiddleColDefsSource.ts", code: minionsMColDefsSource },
                ]}
            >
                <RowClassExample />
            </ExampleShell>
            <ExampleShell
                id="get-row-class"
                title="Get row class"
                description={
                    <span>
                        <b>getRowClass</b> function returns CSS class(es) for each row. Classes are applied dynamically on every render.
                    </span>
                }
                sources={[
                    { label: "GetRowClassExample.tsx", code: getRowClassExampleSource },
                    { label: "minionsMiddleColDefsSource.ts", code: minionsMColDefsSource },
                ]}
            >
                <GetRowClassExample />
            </ExampleShell>
            <ExampleShell
                id="row-class-rules"
                title="Row class rules"
                description={
                    <span>
                        <b>rowClassRules</b> maps rule names to predicates. Every row whose predicate returns true gets the rule name applied as a CSS class.
                        Rules are dynamic and applied in batches — toggle the high-value rule and all visible rows update in a single pass.
                    </span>
                }
                sources={[
                    { label: "RowClassRulesExample.tsx", code: rowClassRulesExampleSource },
                    { label: "minionsMiddleColDefsSource.ts", code: minionsMColDefsSource },
                ]}
            >
                <RowClassRulesExample />
            </ExampleShell>
        </>
    );
}
