const API_ITEMS = [
    ["01", "Grid options", "#grid-options"],
    ["02", "Column definitions", "#column-definitions"],
    ["03", "Plugins", "#plugins"],
    ["04", "Virtualization", "#virtualization"],
] as const;

export function APINav() {
    return (
        <aside className="border-r border-slate px-8 py-15 max-md:border-b max-md:border-r-0 max-md:px-5 max-md:py-10">
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Reference</p>
            <h1 className="mb-13.75 text-[36px] font-normal leading-[.9] tracking-[-.045em] text-ink max-sm:mb-5.5 max-sm:text-5xl">
                API
            </h1>
            <nav className="grid gap-2 max-sm:flex max-sm:flex-wrap max-sm:gap-x-4.5" aria-label="API sections">
                {API_ITEMS.map(([number, title, href]) => (
                    <a
                        className="flex items-center gap-4 py-3 font-sans text-sm hover:text-mint"
                        href={href}
                        key={href}
                    >
                        <strong className="text-[10px] font-normal text-mint">{number}</strong>
                        <span>{title}</span>
                    </a>
                ))}
            </nav>
            <p className="mt-15 max-w-xs font-sans text-xs leading-[1.6] max-sm:mt-6">
                The API is intentionally small. Compose the behavior you need around a stable core.
            </p>
        </aside>
    );
}
