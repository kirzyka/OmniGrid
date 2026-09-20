"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface CodeBlockSource {
    code: string;
    language?: string;
}

interface CodeBlockProps {
    source: CodeBlockSource;
}

const FOR_CUT: RegExp[] = [/"use client";\s?\n?/];

export function CodeBlock({ source }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    FOR_CUT.forEach((p: RegExp) => {
        source.code = source.code.replace(p, "");
    });

    const { code, language } = source;

    const copySource = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <div className="relative bg-[#111111]">
            <button
                className="absolute top-3 right-3 cursor-pointer border border-white/40 bg-[#111111] px-3 py-2 font-sans text-xs text-white hover:border-mint hover:text-mint"
                onClick={copySource}
                type="button"
            >
                {copied ? "Copied" : "Copy code"}
            </button>
            <SyntaxHighlighter
                language={language || "tsx"}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: "18px",
                    paddingRight: "24px",
                    background: "#111111",
                    fontSize: "13px",
                    lineHeight: 1.7,
                }}
                codeTagProps={{
                    style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
