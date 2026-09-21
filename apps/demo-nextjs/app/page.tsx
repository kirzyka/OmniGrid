"use client";

import { useMemo } from "react";

import { SiteHeader } from "@/src/components/ui/SiteHeader";
import { createDemoData } from "@/src/data/demoData";
import { DEMO_COLUMNS } from "@/src/examples/common/GridConfigs";
import { OmniGrid } from "@omnigrid/react";

export default function HomePage() {
    const data = useMemo(createDemoData, []);

    return (
        <main className="flex h-screen flex-col overflow-hidden bg-paper dark:bg-paper-dark">
            <SiteHeader />
            <div className="h-full overflow-y-auto">
                <section
                    className="relative mx-auto flex max-w-[1280px] items-end justify-between px-5 py-[92px] sm:px-8 sm:py-[100px] max-sm:flex-col max-sm:items-start max-sm:gap-[52px] max-sm:pt-[70px]"
                    id="top"
                >
                    <div className="max-w-[760px]">
                        <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint dark:text-mint-dark">
                            Framework-agnostic data infrastructure
                        </p>
                        <h1 className="text-[clamp(54px,8vw,106px)] font-normal leading-[.9] tracking-[-.045em] text-ink dark:text-ink-dark">
                            One grid.
                            <br />
                            <em className="text-mint dark:text-mint-dark">Every framework.</em>
                        </h1>
                        <p className="my-8 max-w-[540px] font-sans text-base leading-[1.6]">
                            OmniGrid gives product teams a fast, extensible data grid with a portable core and adapters for the tools they already use.
                        </p>
                        <div className="flex items-center gap-6">
                            <a
                                className="bg-mint px-5 py-[15px] font-sans text-xs font-bold text-paper hover:bg-slate dark:bg-mint-dark dark:hover:bg-slate-dark"
                                href="/examples/react"
                            >
                                Explore React examples ↗
                            </a>
                            <a className="border-b border-slate pb-1 font-sans text-xs font-bold dark:border-slate-dark" href="#demo">
                                See the common case ↓
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right font-sans max-sm:items-start max-sm:text-left" aria-hidden="true">
                        <span className="mb-[18px] h-[3px] w-[70px] bg-mint dark:bg-mint-dark" />
                        <strong className="font-display text-[38px] font-normal text-ink dark:text-ink-dark">Any stack</strong>
                        <span className="text-xs">one predictable grid model</span>
                    </div>
                </section>

                <section className="mx-auto grid max-w-[1280px] grid-cols-3 border-y border-slate max-sm:grid-cols-1 dark:border-slate-dark">
                    <div className="border-r border-slate px-[30px] py-[38px] max-sm:border-b max-sm:border-r-0 dark:border-slate-dark">
                        <span className="font-sans text-[18px] text-mint dark:text-mint-dark">01</span>
                        <h2 className="my-6 text-[28px] font-normal leading-none tracking-[-.045em]">Portable by design</h2>
                        <p className="font-sans text-[13px] leading-[1.6]">
                            The grid engine stays independent from your UI framework. Use the adapter that fits today and keep the same mental model tomorrow.
                        </p>
                    </div>
                    <div className="border-r border-slate px-[30px] py-[38px] max-sm:border-b max-sm:border-r-0 dark:border-slate-dark">
                        <span className="font-sans text-[18px] text-mint dark:text-mint-dark">02</span>
                        <h2 className="my-6 text-[28px] font-normal leading-none tracking-[-.045em]">Small core, open edges</h2>
                        <p className="font-sans text-[13px] leading-[1.6]">
                            Sorting and future behaviors live in plugins, so the default table remains easy to understand and easy to extend.
                        </p>
                    </div>
                    <div className="px-[30px] py-[38px]">
                        <span className="font-sans text-[18px] text-mint dark:text-mint-dark">03</span>
                        <h2 className="my-6 text-[28px] font-normal leading-none tracking-[-.045em]">Made for real data</h2>
                        <p className="font-sans text-[13px] leading-[1.6]">
                            Virtualized rows, flexible columns, custom renderers, and the performance you expect from a production interface.
                        </p>
                    </div>
                </section>

                <section className="mx-auto max-w-[1280px] px-5 py-[94px] sm:px-8 sm:pb-[110px]" id="demo">
                    <div className="mb-7 flex items-end justify-between max-sm:flex-col max-sm:items-start max-sm:gap-[18px]">
                        <div>
                            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint dark:text-mint-dark">The common case</p>
                            <h2 className="text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-.045em]">A table that gets out of the way</h2>
                        </div>
                        <p className="max-w-[260px] font-sans text-xs leading-[1.6]">
                            This is the plain OmniGrid: no plugins, just data, columns, and a reliable viewport.
                        </p>
                    </div>
                    <div className="border border-slate bg-paper dark:border-slate-dark dark:bg-paper-dark">
                        <div className="flex items-center justify-between border-b border-slate px-4 py-[13px] font-sans text-[11px] uppercase dark:border-slate-dark">
                            <span>
                                <i className="mr-[7px] inline-block size-[7px] rounded-full bg-mint dark:bg-mint-dark" /> Live dataset
                            </span>
                            <span>
                                {data.length.toLocaleString("en-US")} rows <b>·</b> {DEMO_COLUMNS.length} columns
                            </span>
                        </div>
                        <div className="h-[420px] sm:h-[540px]">
                            <OmniGrid columns={DEMO_COLUMNS} data={data} style={{ height: "100%", width: "100%" }} />
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4 mx-auto max-w-[1280px] border-t border-slate px-5 py-[100px] sm:px-8 sm:pb-[115px] dark:border-slate-dark">
                    <p className=" font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint dark:text-mint-dark">Meet it in your stack</p>
                    <h2 className="max-w-[760px] text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-.045em]">
                        React today. Angular, Vue, Svelte, or anything else tomorrow.
                    </h2>
                    <p className="max-w-[500px] font-sans text-xs leading-[1.6]">
                        OmniGrid is framework agnostic at the core. See the React implementation now, then use the same concepts in the framework your product
                        calls home.
                    </p>
                    <div>
                        <a
                            className="inline-block bg-mint px-5 py-[15px] font-sans text-xs font-bold text-paper hover:bg-slate dark:bg-mint-dark dark:hover:bg-slate-dark"
                            href="/examples/react"
                        >
                            Browse React examples ↗
                        </a>
                    </div>
                </section>
                <footer className="mx-auto flex max-w-[1280px] justify-between border-t border-slate px-5 py-5 pb-[34px] font-sans text-[11px] uppercase sm:px-8 max-sm:flex-col max-sm:gap-2.5 dark:border-slate-dark">
                    <span>OmniGrid</span>
                    <span>Framework agnostic. Product ready.</span>
                </footer>
            </div>
        </main>
    );
}
