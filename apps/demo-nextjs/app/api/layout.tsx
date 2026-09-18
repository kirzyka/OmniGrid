import type { ReactNode } from "react";

import { SiteHeader } from "../../src/components/SiteHeader";

const API_ITEMS = [
    ["01", "Grid options", "#grid-options"],
    ["02", "Column definitions", "#column-definitions"],
    ["03", "Plugins", "#plugins"],
    ["04", "Virtualization", "#virtualization"],
] as const;

export default function ApiLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen overflow-hidden bg-paper">
            <SiteHeader />
            <div className="grid min-h-[calc(100vh-73px)] grid-cols-[280px_1fr] max-md:block">
                <aside className="border-r border-slate px-8 py-[70px] max-md:border-b max-md:border-r-0 max-md:px-5 max-md:py-[42px]">
                    <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">
                        Reference
                    </p>
                    <h1 className="mb-[55px] text-[58px] font-normal leading-[.9] tracking-[-.045em] text-ink max-md:mb-[22px] max-md:text-5xl">
                        API
                    </h1>
                    <nav
                        className="grid gap-2 max-md:flex max-md:flex-wrap max-md:gap-x-[18px]"
                        aria-label="API sections"
                    >
                        {API_ITEMS.map(([number, title, href]) => (
                            <a
                                className="flex items-center gap-4 py-3 font-sans text-sm hover:text-mint"
                                href={href}
                                key={href}
                            >
                                <strong className="text-[10px] font-normal text-mint">{number}</strong>
                                <span>{title}</span>
                            </a>
                        ))}
                    </nav>
                    <p className="mt-[60px] font-sans text-xs leading-[1.6] max-md:mt-6">
                        The API is intentionally small. Compose the behavior you need around a stable core.
                    </p>
                </aside>
                {children}
            </div>
        </main>
    );
}
