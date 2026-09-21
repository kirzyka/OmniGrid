"use client";

import type { ReactNode } from "react";

import { SiteHeader } from "../../src/components/ui/SiteHeader";
import { ExamplesNav } from "../../src/components/ui/example/ExamplesNav";

export default function ReactExamplesLayout({ children }: { children: ReactNode }) {
    return (
        <main className="flex h-screen flex-col overflow-hidden bg-paper dark:bg-paper-dark">
            <SiteHeader />
            <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)] max-md:grid-cols-1 max-md:grid-rows-[minmax(0,40vh)_minmax(0,1fr)]">
                <div className="h-full overflow-y-auto border-r border-slate dark:border-slate-dark max-md:border-b max-md:border-r-0">
                    <ExamplesNav />
                </div>
                <div className="h-full overflow-y-auto">
                    <div className="flex flex-col gap-4 p-5">{children}</div>
                </div>
            </div>
        </main>
    );
}
