"use client";

import { type ReactNode, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useTheme } from "next-themes";

import { CopyButton } from "../button/CopyButton";

export interface ExampleSource {
    label: string;
    code: string;
}

interface ExampleShellProps {
    id?: string;
    title: string;
    description: string;
    sources: ExampleSource[];
    children: ReactNode;
}

function getLanguage(label: string): string {
    const extension = label.split(".").pop()?.toLowerCase();
    if (extension === "css" || extension === "scss") return extension;
    if (extension === "ts") return "typescript";
    return "tsx";
}

export function ExampleShell({ id, title, description, sources, children }: ExampleShellProps) {
    sources = sources.map((s: ExampleSource) => ({ ...s, code: s.code.replace('"use client";', "").trim() }));

    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const [activeSource, setActiveSource] = useState(0);
    const source = sources[activeSource] ?? sources[0];

    return (
        <section id={id} className="scroll-mt-8 p-5 pb-10">
            <h2 className="text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-.045em]">{title}</h2>
            <p className="my-5.5 max-w-170 font-sans text-sm leading-[1.6]">{description}</p>
            <div className="border border-slate bg-paper  dark:bg-paper-dark">
                <div className="flex gap-1 border-b border-slate px-3" role="tablist" aria-label={`${title} views`}>
                    <button
                        className={`cursor-pointer border-b-2 bg-transparent px-3 pb-3 pt-3.5 font-sans text-xs ${activeTab === "preview" ? "border-mint text-mint" : "border-transparent text-ink dark:text-ink-dark"}`}
                        onClick={() => setActiveTab("preview")}
                        role="tab"
                        aria-selected={activeTab === "preview"}
                    >
                        Preview
                    </button>
                    <button
                        className={`cursor-pointer border-b-2 bg-transparent px-3 pb-3 pt-3.5 font-sans text-xs ${activeTab === "code" ? "border-mint text-mint" : "border-transparent text-ink dark:text-ink-dark"}`}
                        onClick={() => setActiveTab("code")}
                        role="tab"
                        aria-selected={activeTab === "code"}
                    >
                        Code
                    </button>
                </div>
                {activeTab === "preview" ? (
                    <div className="h-105 sm:h-110">{children}</div>
                ) : (
                    <div className="relative  bg-paper dark:bg-paper-dark">
                        <div className="flex gap-1 overflow-x-auto border-b border-white/15 px-3" role="tablist" aria-label="Example source files">
                            {sources.map((item, index) => (
                                <button
                                    className={`cursor-pointer shrink-0 border-b-2 bg-transparent px-3 pb-3 pt-3.5 font-sans text-xs ${activeSource === index ? "border-mint  text-ink dark:text-ink-dark" : "border-transparent text-ink dark:text-ink-dark"}`}
                                    key={item.label}
                                    onClick={() => {
                                        setActiveSource(index);
                                    }}
                                    role="tab"
                                    aria-selected={activeSource === index}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <CopyButton text={source.code} />
                        <SyntaxHighlighter
                            language={getLanguage(source.label)}
                            style={theme === "dark" ? vscDarkPlus : vs}
                            customStyle={{
                                margin: 0,
                                minHeight: "420px",
                                padding: "26px",
                                paddingRight: "128px",
                                fontSize: "13px",
                                lineHeight: 1.7,
                            }}
                            codeTagProps={{
                                style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
                            }}
                        >
                            {source.code}
                        </SyntaxHighlighter>
                    </div>
                )}
            </div>
        </section>
    );
}
