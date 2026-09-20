import type { ReactNode } from "react";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import "@omnigrid/style/index.css";

import "@/src/style/app.css";

export const metadata: Metadata = {
    title: "OmniGrid | Framework-agnostic data grid",
    description: "A fast, extensible data grid for any framework.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class" defaultTheme="light">
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
