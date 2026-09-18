"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const EXAMPLES = [
    ["01", "Core grid", "/examples/react/core"],
    ["02", "Sorting plugin", "/examples/react/sorting"],
] as const;

export function ReactExamplesNav() {
    const pathname = usePathname();

    return (
        <>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">React adapter</p>
            <h1 className="mb-[55px] text-[36px] font-normal leading-[.9] tracking-[-.045em] text-ink max-sm:mb-[22px] max-sm:text-5xl">
                Examples
            </h1>
            <nav className="grid gap-2 max-sm:flex max-sm:flex-wrap max-sm:gap-x-[18px]" aria-label="React examples">
                {EXAMPLES.map(([number, title, href]) => (
                    <Link
                        className={`flex items-center gap-4 border-b border-transparent py-3 font-sans text-sm hover:text-mint ${pathname === href ? "border-slate text-mint" : ""}`}
                        href={href}
                        key={href}
                    >
                        <strong className="text-[10px] font-normal text-mint">{number}</strong>
                        <span>{title}</span>
                    </Link>
                ))}
            </nav>
            <p className="mt-[60px] max-w-xs font-sans text-xs leading-[1.6] max-sm:mt-6">
                Every example pairs a working table with the smallest useful integration.
            </p>
        </>
    );
}
