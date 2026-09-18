import type { ReactNode } from "react";

import { SiteHeader } from "../../src/components/SiteHeader";
import { ExamplesNav } from "../../src/components/example/ExamplesNav";

export default function ReactExamplesLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen overflow-hidden bg-paper">
            <SiteHeader />
            <div className="grid min-h-[calc(100vh-73px)] grid-cols-[280px_1fr] max-md:block">
                <ExamplesNav />
                <div className="flex flex-col gap-4 p-5">{children}</div>
            </div>
        </main>
    );
}
