"use client";

import { type ReactNode, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLink {
    label: string;
    href: string;
}

export interface NavItem {
    label: string;
    href: string;
    children?: NavLink[];
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
    {
        label: "Getting Started",
        items: [{ label: "Quick start", href: "/examples/quick-start" }],
    },
    {
        label: "Columns",
        items: [],
    },
    {
        label: "Rows",
        items: [{ label: "No row hover", href: "/examples/react/rows/no-hover" }],
    },
    {
        label: "Cells",
        items: [],
    },
    {
        label: "Plugins",
        items: [
            {
                label: "Base",
                href: "/examples/react/plugins/base",
                children: [
                    { label: "Base case", href: "/examples/react/plugins/base/core" },
                    { label: "Sorting", href: "/examples/react/plugins/base/sorting" },
                    { label: "Selection", href: "/examples/react/plugins/base/selection" },
                ],
            },
            {
                label: "Pro",
                href: "/examples/react/plugins/pro",
                children: [],
            },
        ],
    },
];

function splitHash(href: string): [path: string, hash: string] {
    const [path, hash = ""] = href.split("#");
    return [path, hash];
}

function isActive(href: string, pathname: string, hash: string): boolean {
    const [path, targetHash] = splitHash(href);
    return path === pathname && (targetHash === "" || targetHash === hash);
}

function isInSubtree(item: NavItem, pathname: string): boolean {
    if (pathname === item.href) return true;
    const base = item.href.replace(/\/$/, "");
    if (pathname.startsWith(`${base}/`)) return true;
    const children = item.children ?? [];
    return children.some((child) => splitHash(child.href)[0] === pathname);
}

export function ExamplesNav() {
    const pathname = usePathname();
    const [hash, setHash] = useState("");
    const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => {
        const labels = NAV_GROUPS.flatMap((group) => group.items)
            .filter((item) => (item.children?.length ?? 0) > 0)
            .filter((item) => isInSubtree(item, pathname))
            .map((item) => item.label);
        return new Set(labels);
    });

    useEffect(() => {
        const readHash = () => setHash(window.location.hash.replace(/^#/, ""));
        readHash();
        window.addEventListener("hashchange", readHash);
        return () => window.removeEventListener("hashchange", readHash);
    }, []);

    // Auto-expand branches whose subtree contains the current route.
    useEffect(() => {
        setExpanded((previous) => {
            const toAdd = NAV_GROUPS.flatMap((group) => group.items)
                .filter((item) => (item.children?.length ?? 0) > 0)
                .filter((item) => isInSubtree(item, pathname))
                .map((item) => item.label);
            if (toAdd.length === 0) return previous;
            const next = new Set(previous);
            toAdd.forEach((label) => next.add(label));
            return next;
        });
    }, [pathname]);

    const toggleExpanded = (label: string) => {
        setExpanded((previous) => {
            const next = new Set(previous);
            if (next.has(label)) next.delete(label);
            else next.add(label);
            return next;
        });
    };

    const renderChild = (child: NavLink): ReactNode => {
        const active = isActive(child.href, pathname, hash);
        return (
            <li key={child.href}>
                <Link
                    href={child.href}
                    onClick={() => setHash(splitHash(child.href)[1])}
                    className={`flex items-center border-l py-2 pl-4 font-sans text-[13px] hover:text-mint dark:hover:text-mint-dark ${
                        active ? "border-mint text-mint dark:text-mint-dark" : "border-slate/40 text-ink dark:text-ink-dark dark:border-slate-dark/40"
                    }`}
                >
                    {child.label}
                </Link>
            </li>
        );
    };

    const renderItem = (item: NavItem, index: number): ReactNode => {
        const hasChildren = item.children !== undefined && item.children.length > 0;
        const children = item.children ?? [];
        const isOpen = hasChildren && expanded.has(item.label);
        const active = isActive(item.href, pathname, hash);

        return (
            <li key={item.label}>
                <div className="flex items-center">
                    <Link
                        href={item.href}
                        className={`flex min-w-0 flex-1 items-center gap-3  py-2.5 font-sans text-sm hover:text-mint dark:hover:text-mint-dark ${
                            active ? " text-mint dark:text-mint-dark" : ""
                        }`}
                    >
                        <strong className="text-[10px] font-normal text-mint">
                            {String(index + 1).padStart(2, "0")}
                        </strong>
                        <span className="truncate">{item.label}</span>
                    </Link>
                    {hasChildren && (
                        <button
                            type="button"
                            aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                            aria-expanded={isOpen}
                            onClick={() => toggleExpanded(item.label)}
                            className="cursor-pointer border-b border-transparent p-2.5 font-sans text-xs text-slate dark:text-slate-dark hover:text-mint dark:hover:text-mint-dark"
                        >
                            <span
                                className={`inline-block transition-transform duration-150 ${
                                    isOpen ? "rotate-90" : ""
                                }`}
                                aria-hidden="true"
                            >
                                ›
                            </span>
                        </button>
                    )}
                </div>
                {hasChildren && (
                    <ul className={isOpen ? "grid" : "hidden"} role="list">
                        {children.map(renderChild)}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <aside className="border-r border-slate dark:border-slate-dark px-8 py-15 max-md:border-b max-md:border-r-0 max-md:px-5 max-md:py-10">
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint dark:text-mint-dark">React adapter</p>
            <h1 className="mb-13.75 text-[36px] font-normal leading-[.9] tracking-[-.045em] text-ink dark:text-ink-dark max-sm:mb-5.5 max-sm:text-5xl">
                Examples
            </h1>
            <nav aria-label="React examples">
                {NAV_GROUPS.map((group) => (
                    <section key={group.label} className="mb-8">
                        <h2 className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-slate dark:text-slate-dark">
                            {group.label}
                        </h2>
                        <div className="mb-3 h-px w-full bg-slate/40 dark:bg-slate-dark/40" aria-hidden="true" />
                        <ul className="grid gap-2">{group.items.map((item, index) => renderItem(item, index))}</ul>
                    </section>
                ))}
            </nav>
            <p className="mt-15 max-w-xs font-sans text-xs leading-[1.6] max-sm:mt-6 text-ink dark:text-ink-dark">
                Every example pairs a working table with the smallest useful integration.
            </p>
        </aside>
    );
}
