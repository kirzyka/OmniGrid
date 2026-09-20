"use client";

import type { ReactNode } from "react";

import { APINav } from "../../src/components/api/APINav";
import { SiteHeader } from "../../src/components/ui/SiteHeader";

export default function ApiLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen overflow-hidden bg-paper dark:bg-paper-dark">
            <SiteHeader />
            <div className="grid min-h-[calc(100vh-73px)] grid-cols-[280px_1fr] max-md:block">
                <APINav />
                <div className="flex flex-col gap-4 p-5">{children}</div>
            </div>
        </main>
    );
}