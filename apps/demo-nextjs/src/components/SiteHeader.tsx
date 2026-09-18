import Link from "next/link";

export function SiteHeader() {
    return (
        <header className="flex items-center justify-between border-b border-slate px-5 py-[22px] sm:px-8">
            <Link
                className="flex items-center gap-2.5 text-[21px] font-bold text-ink"
                href="/"
                aria-label="OmniGrid home"
            >
                <span className="inline-flex size-7 items-center justify-center bg-mint font-sans text-sm text-paper">
                    O
                </span>
                OmniGrid
            </Link>
            <nav className="flex gap-3 font-sans text-xs sm:gap-[26px]" aria-label="Main navigation">
                <Link className="hover:text-mint max-sm:hidden" href="/examples/react">
                    React examples
                </Link>
                <Link href="/api">API</Link>
                <Link href="/license">License</Link>
                <a className="hover:text-mint" href="https://github.com" target="_blank" rel="noreferrer">
                    GitHub ↗
                </a>
            </nav>
        </header>
    );
}
