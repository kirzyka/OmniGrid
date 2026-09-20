"use client";

import { ThemeSwitcher } from "@/src/components/ui/theme/ThemeSwitcher";
import Link from "next/link";

export function SiteHeader() {
    return (
        <header className="flex items-center justify-between border-b border-slate dark:border-slate-dark px-5 py-[22px] sm:px-8">
            <Link className="flex items-center gap-2.5 text-[21px] font-bold text-ink dark:text-ink-dark" href="/" aria-label="OmniGrid home">
                <span className="inline-flex size-7 items-center justify-center bg-mint dark:bg-mint-dark font-sans text-sm text-paper">O</span>
                OmniGrid
            </Link>
            <nav className="flex items-center gap-3 font-sans text-xs sm:gap-[26px]" aria-label="Main navigation">
                <Link className="hover:text-mint dark:hover:text-mint-dark max-sm:hidden" href="/examples/quick-start">
                    Examples
                </Link>
                <Link className="hover:text-mint dark:hover:text-mint-dark" href="/api">
                    API
                </Link>
                <Link className="hover:text-mint dark:hover:text-mint-dark" href="/license">
                    License
                </Link>
                <a className="hover:text-mint dark:hover:text-mint-dark" href="https://github.com" target="_blank" rel="noreferrer">
                    GitHub ↗
                </a>
                <ThemeSwitcher />
            </nav>
        </header>
    );
}
