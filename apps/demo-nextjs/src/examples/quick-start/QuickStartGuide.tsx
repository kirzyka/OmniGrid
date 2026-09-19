"use client";

import { CodeBlock, type CodeBlockSource } from "@/src/components/ui/code/CodeBlock";
import dataSource from "@/src/data/staticMinions.ts?raw";
import { QuickStartGridExample } from "@/src/examples/quick-start/QuickStartGridExample";
import quickStartGridSource from "@/src/examples/quick-start/QuickStartGridExample.tsx?raw";
import columnDefsSource from "@/src/examples/quick-start/quickStartColumnDefs.ts?raw";

const INSTALL_REACT_SNIPPET = `npm install @omnigrid/react`;
const INSTALL_PLUGIN_SNIPPET = `npm install @omnigrid/selection-plugin @omnigrid/sorting-plugin`;

const MINIMAL_SNIPPET = `import { MINIONS_DATASET } from "@/src/data/staticMinions";
import { OmniGrid } from "@omnigrid/react";

import { quickStartColumnDefs } from "./quickStartColumnDefs";

export function QuickStartGridExample() {
    return <OmniGrid columns={quickStartColumnDefs} data={MINIONS_DATASET} />;
}`;

interface QuickStartStep {
    title: string;
    description: string;
    source: CodeBlockSource;
}

const STEPS: QuickStartStep[] = [
    {
        title: "Install adapter",
        description:
            "Install the React wrapper. It brings the framework-agnostic grid core with it, so the component is ready to use in a React application.",
        source: { code: INSTALL_REACT_SNIPPET, language: "bash" },
    },
    {
        title: "Write the minimal integration",
        description:
            "Render the OmniGrid component with column definitions and a data array. When no height is provided, the React wrapper grows to fit the grid; provide a height when you want a scrollable, virtualized viewport.",
        source: { code: MINIMAL_SNIPPET },
    },
    {
        title: "Describe your columns",
        description:
            "Create a ColumnDef for each visible field. Give every column a stable id, then choose its field, width, or flex behavior. Formatters, cell renderers, visibility, sorting, and cell alignment are configured here; the align property affects only cell content.",
        source: { code: columnDefsSource },
    },
    {
        title: "Connect the data",
        description:
            "Pass any array of rows to the data prop: a local static dataset, an asynchronous response, or generated data. The row type and the column fields should describe the same shape, which keeps the configuration predictable and type-safe.",
        source: { code: dataSource },
    },
    {
        title: "Install plugins",
        description:
            "Install only the plugins needed by the grid. Sorting and selection are separate packages, so features stay opt-in and the base grid remains small.",
        source: { code: INSTALL_PLUGIN_SNIPPET },
    },
    {
        title: "Attach plugins",
        description:
            "Create the plugin instances once and pass them through the plugins prop. Sorting adds header sorting, while selection adds row highlighting and optional checkboxes. That is the complete integration: install the wrapper, configure columns and data, add the plugins you need, and the grid is ready.",
        source: { code: quickStartGridSource },
    },
];
export function QuickStartGuide() {
    return (
        <>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Getting started</p>
            <h2 className="max-w-185 text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-.045em]">
                Quick Start
            </h2>
            <p className="my-5.5 max-w-170 font-sans text-sm leading-[1.6]">
                OmniGrid is a data grid built on a framework-agnostic core: the engine owns rows, columns, state,
                viewport geometry, and virtualization, with no DOM and no framework imports. Optional behavior ships as
                plugins — free Base plugins like sorting, filtering, and selection, plus commercial Pro plugins for
                grouping, tree data, and export. Thin adapters bind the same core to any current UI stack. This guide
                demonstrates the React adapter.
            </p>

            {STEPS.map((step, index) => (
                <section key={step.title} className="">
                    <div className="flex items-center gap-3 border-b border-slate px-4 py-3 font-sans text-[22px] mb-4">
                        <strong className="text-mint">{String(index + 1).padStart(2, "0")}</strong>
                        <h3 className="m-0 flex-1 text-[15px] font-bold text-ink">{step.title}</h3>
                    </div>
                    <p className="px-4 pb-2.5 font-sans text-[14px] leading-[1.6]">{step.description}</p>
                    <CodeBlock source={step.source} />
                </section>
            ))}

            <section id="result" className="flex flex-col gap-4">
                <div>
                    <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">
                        The result
                    </p>
                    <h3 className="max-w-190 text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-.045em]">
                        Run it live
                    </h3>
                    <p className="my-5.5 max-w-135 font-sans text-xs leading-[1.6]">
                        A compact minion register with sorting and selection enabled. Click a column header to sort, or
                        use the checkboxes to select rows. The same setup also works with larger datasets and a fixed
                        height when you need viewport virtualization.
                    </p>
                </div>
                <div className="border border-slate bg-paper">
                    <div className="flex items-center justify-between border-b border-slate px-4 py-[13px] font-sans text-[11px] uppercase">
                        <span>
                            <i className="mr-[7px] inline-block size-[7px] rounded-full bg-mint" /> Live grid
                        </span>
                        <span>3 rows · sorting plugin · selection plugin</span>
                    </div>
                    <QuickStartGridExample />
                </div>
            </section>
        </>
    );
}
