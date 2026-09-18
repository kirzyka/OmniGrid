"use client";

import { type ReactNode, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface ExampleSource {
    label: string;
    code: string;
}

interface ExampleShellProps {
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

export function ExampleShell({ title, description, sources, children }: ExampleShellProps) {
    sources = sources.map((s: ExampleSource) => ({ ...s, code: s.code.replace('"use client";', "").trim() }));

    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const [activeSource, setActiveSource] = useState(0);
    const [copied, setCopied] = useState(false);
    const source = sources[activeSource] ?? sources[0];

    const copySource = async () => {
        await navigator.clipboard.writeText(source.code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <section className="p-5 pb-10">
            <h2 className="text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-.045em]">{title}</h2>
            <p className="my-5.5 max-w-170 font-sans text-sm leading-[1.6]">{description}</p>
            <div className="border border-slate bg-paper">
                <div className="flex gap-1 border-b border-slate px-3" role="tablist" aria-label={`${title} views`}>
                    <button
                        className={`cursor-pointer border-b-2 bg-transparent px-3 pb-3 pt-3.5 font-sans text-xs ${activeTab === "preview" ? "border-mint text-mint" : "border-transparent text-ink"}`}
                        onClick={() => setActiveTab("preview")}
                        role="tab"
                        aria-selected={activeTab === "preview"}
                    >
                        Preview
                    </button>
                    <button
                        className={`cursor-pointer border-b-2 bg-transparent px-3 pb-3 pt-3.5 font-sans text-xs ${activeTab === "code" ? "border-mint text-mint" : "border-transparent text-ink"}`}
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
                    <div className="relative bg-[#111111]">
                        <div
                            className="flex gap-1 overflow-x-auto border-b border-white/15 px-3"
                            role="tablist"
                            aria-label="Example source files"
                        >
                            {sources.map((item, index) => (
                                <button
                                    className={`cursor-pointer shrink-0 border-b-2 bg-transparent px-3 pb-3 pt-3.5 font-sans text-xs ${activeSource === index ? "border-mint text-white" : "border-transparent text-white/70 hover:text-white"}`}
                                    key={item.label}
                                    onClick={() => {
                                        setActiveSource(index);
                                        setCopied(false);
                                    }}
                                    role="tab"
                                    aria-selected={activeSource === index}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <button
                            className="absolute right-4 top-15 z-10 border border-white/40 bg-[#111111] px-3 py-2 font-sans text-xs text-white hover:border-mint hover:text-mint"
                            onClick={copySource}
                            type="button"
                        >
                            {copied ? "Copied" : "Copy code"}
                        </button>
                        <SyntaxHighlighter
                            language={getLanguage(source.label)}
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                minHeight: "420px",
                                padding: "26px",
                                paddingRight: "128px",
                                background: "#111111",
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
