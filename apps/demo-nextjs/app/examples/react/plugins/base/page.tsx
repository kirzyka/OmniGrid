export default function ReactExamplesIndexPage() {
    return (
        <div>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">Examples</p>
            <h2 className="max-w-185 text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-.045em]">
                Build your own data surface
            </h2>
            <p className="my-5.5 max-w-170 font-sans text-sm leading-[1.6]">
                OmniGrid separates the grid engine from framework bindings and optional behavior. That keeps
                integrations familiar while the runtime stays portable.
            </p>
            <a
                className="bg-mint px-5 py-4 font-sans text-xs font-bold text-paper hover:bg-slate"
                href="/examples/react/nextjs"
            >
                Next.js
            </a>
        </div>
    );
}
