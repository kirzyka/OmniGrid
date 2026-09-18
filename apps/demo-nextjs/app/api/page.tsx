const API_ITEMS = [
    ["Grid options", "Define columns, rows, dimensions, and plugin composition."],
    ["Column definitions", "Use fields, accessors, formatters, renderers, and flexible widths."],
    ["Plugins", "Register focused behavior such as sorting without coupling it to the core."],
    ["Virtualization", "Render only the visible rows and columns for predictable performance."],
];

export default function ApiPage() {
    return (
        <div>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">
                Core reference / v0.1
            </p>
            <h2 className="max-w-[740px] text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-.045em]">
                Build your own data surface
            </h2>
            <p className="my-[22px] max-w-[680px] font-sans text-sm leading-[1.6]">
                OmniGrid separates the grid engine from framework bindings and optional behavior. That keeps
                integrations familiar while the runtime stays portable.
            </p>
            {API_ITEMS.map(([title, description], index) => (
                <section
                    className="mt-[52px] grid grid-cols-[50px_1fr] gap-6 border-t border-slate pt-[26px]"
                    id={title.toLowerCase().replace(" ", "-")}
                    key={title}
                >
                    <span className="font-sans text-[11px] text-mint">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                        <h3 className="text-[30px] font-normal tracking-[-.045em]">{title}</h3>
                        <p className="my-[10px] font-sans text-[13px] leading-[1.6]">{description}</p>
                        <pre className="m-0 overflow-auto bg-slate px-5 py-4 font-mono text-[13px] leading-[1.7] text-paper">
                            <code>
                                {index === 0
                                    ? "<OmniGrid columns={columns} data={rows} />"
                                    : index === 1
                                      ? '{ id: "name", field: "name", flex: 1 }'
                                      : index === 2
                                        ? "plugins={[sortingPlugin]}"
                                        : "rowOverscan={6}"}
                            </code>
                        </pre>
                    </div>
                </section>
            ))}
        </div>
    );
}
