"use client";

import { type ReactNode, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface ExampleSource {
    label: string;
    code: string;
}

interface ExampleShellProps {
    eyebrow: string;
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

export function ExampleShell({ eyebrow, title, description, sources, children }: ExampleShellProps) {
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
        <div className="px-5 py-[48px] sm:px-[52px] sm:py-[70px] sm:pb-[100px]">
            <section className="border-b border-slate pb-20">
                <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">{eyebrow}</p>
                <h2 className="text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-.045em]">{title}</h2>
                <p className="my-[22px] max-w-[680px] font-sans text-sm leading-[1.6]">{description}</p>
                <div className="border border-slate bg-paper">
                    <div className="flex gap-1 border-b border-slate px-3" role="tablist" aria-label={`${title} views`}>
                        <button
                            className={`border-b-2 border-transparent bg-transparent px-3 pb-[11px] pt-[14px] font-sans text-xs text-ink ${activeTab === "preview" ? "border-mint text-mint" : ""}`}
                            onClick={() => setActiveTab("preview")}
                            role="tab"
                            aria-selected={activeTab === "preview"}
                        >
                            Preview
                        </button>
                        <button
                            className={`border-b-2 border-transparent bg-transparent px-3 pb-[11px] pt-[14px] font-sans text-xs text-ink ${activeTab === "code" ? "border-mint text-mint" : ""}`}
                            onClick={() => setActiveTab("code")}
                            role="tab"
                            aria-selected={activeTab === "code"}
                        >
                            Code
                        </button>
                    </div>
                    {activeTab === "preview" ? (
                        <div className="h-[420px] sm:h-[440px]">{children}</div>
                    ) : (
                        <div className="relative bg-[#111111]">
                            <div
                                className="flex gap-1 overflow-x-auto border-b border-white/15 px-3"
                                role="tablist"
                                aria-label="Example source files"
                            >
                                {sources.map((item, index) => (
                                    <button
                                        className={`shrink-0 border-b-2 border-transparent bg-transparent px-3 pb-[11px] pt-[14px] font-sans text-xs text-white/70 ${activeSource === index ? "border-mint text-white" : "hover:text-white"}`}
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
                                className="absolute right-4 top-[62px] z-10 border border-white/40 bg-[#111111] px-3 py-2 font-sans text-xs text-white hover:border-mint hover:text-mint"
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
        </div>
    );
}
