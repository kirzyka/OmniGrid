import { SiteHeader } from "../../src/components/SiteHeader";

export default function LicensePage() {
    return (
        <main className="min-h-screen overflow-hidden bg-paper">
            <SiteHeader />
            <section className="mx-auto max-w-[1280px] px-5 py-[110px] sm:px-8 sm:pb-[130px]">
                <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-mint">
                    Commercial license
                </p>
                <h1 className="max-w-[700px] text-[clamp(54px,8vw,106px)] font-normal leading-[.9] tracking-[-.045em] text-ink">
                    Ship your grid
                    <br />
                    <em className="text-mint">with confidence.</em>
                </h1>
                <p className="my-7 font-sans text-base leading-[1.6]">
                    A simple license for teams building serious products with OmniGrid.
                </p>
                <div className="grid max-w-[740px] grid-cols-2 gap-5 max-sm:grid-cols-1">
                    <div className="flex flex-col border border-slate bg-paper p-7">
                        <span className="font-sans text-[11px] uppercase text-mint">Team</span>
                        <strong className="my-6 text-5xl font-normal">$499</strong>
                        <span className="font-sans text-xs">per year / per team</span>
                        <button className="mt-[35px] bg-mint p-[14px] font-sans text-xs font-bold text-paper">
                            Choose team
                        </button>
                    </div>
                    <div className="flex flex-col border-2 border-mint bg-paper p-7">
                        <span className="font-sans text-[11px] uppercase text-mint">Product</span>
                        <strong className="my-6 text-5xl font-normal">$1,499</strong>
                        <span className="font-sans text-xs">per year / unlimited seats</span>
                        <button className="mt-[35px] bg-mint p-[14px] font-sans text-xs font-bold text-paper">
                            Choose product
                        </button>
                    </div>
                </div>
                <p className="mt-[38px] font-sans text-xs leading-[1.6]">
                    This page is a payment flow placeholder. Checkout integration will be connected here.
                </p>
            </section>
        </main>
    );
}
