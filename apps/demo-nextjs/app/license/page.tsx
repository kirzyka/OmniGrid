import { SiteHeader } from "@/src/components/ui/SiteHeader";

export default function LicensePage() {
    return (
        <main className="min-h-screen overflow-hidden bg-paper dark:bg-paper-dark">
            <SiteHeader />
            <section className="mx-auto max-w-[1280px] px-5 py-27 sm:px-8 sm:pb-32">
                <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint dark:text-mint-dark">Commercial license</p>
                <h1 className="max-w-175 text-[clamp(54px,8vw,106px)] font-normal leading-[.9] tracking-[-.045em] text-ink dark:text-ink-dark">
                    Ship your grid
                    <br />
                    <em className="text-mint dark:text-mint-dark">with confidence.</em>
                </h1>
                <p className="my-7 font-sans text-base leading-[1.6]">A simple license for teams building serious products with OmniGrid.</p>
                <div className="grid max-w-185 grid-cols-2 gap-5 max-sm:grid-cols-1">
                    <div className="flex flex-col border border-slate bg-paper p-7 dark:border-slate-dark dark:bg-paper-dark">
                        <span className="font-sans text-[11px] uppercase text-mint dark:text-mint-dark">Team</span>
                        <strong className="my-6 text-5xl font-normal">$499</strong>
                        <span className="font-sans text-xs">per year / per team</span>
                        <button className="mt-9 bg-mint p-3.5 font-sans text-xs font-bold text-paper dark:bg-mint-dark">Choose team</button>
                    </div>
                    <div className="flex flex-col border-2 border-mint bg-paper p-7 dark:border-mint-dark dark:bg-paper-dark">
                        <span className="font-sans text-[11px] uppercase text-mint dark:text-mint-dark">Product</span>
                        <strong className="my-6 text-5xl font-normal">$1,499</strong>
                        <span className="font-sans text-xs">per year / unlimited seats</span>
                        <button className="mt-9 bg-mint p-3.5 font-sans text-xs font-bold text-paper dark:bg-mint-dark">Choose product</button>
                    </div>
                </div>
                <p className="mt-9 font-sans text-xs leading-[1.6]">This page is a payment flow placeholder. Checkout integration will be connected here.</p>
            </section>
        </main>
    );
}
