import type { ReactNode } from "react";

import { SiteHeader } from "../../../src/components/SiteHeader";
import { ExamplesNav } from "../../../src/components/example/ExamplesNav";

export default function ReactExamplesLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen overflow-hidden bg-paper">
            <SiteHeader />
            <div className="grid min-h-[calc(100vh-73px)] grid-cols-[280px_1fr] max-md:block">
                <aside className="border-r border-slate px-8 py-15 max-md:border-b max-md:border-r-0 max-md:px-5 max-md:py-10">
                    <ExamplesNav />
                </aside>
                <div className="flex flex-col gap-4 p-5">{children}</div>
            </div>
        </main>
    );
}
