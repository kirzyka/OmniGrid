import { useState } from "react";

interface Props {
    text: string;
}

export function CopyButton({ text }: Props) {
    const [copied, setCopied] = useState(false);
    const copySource = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <button
            className="absolute right-4 top-15 z-10 border border-white/40 bg-[#111111] px-3 py-2 font-sans text-xs text-white hover:border-mint hover:text-mint"
            onClick={copySource}
            type="button"
        >
            {copied ? "Copied" : "Copy code"}
        </button>
    );
}
