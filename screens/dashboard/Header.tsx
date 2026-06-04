import { useGetActiveOrdersCount } from "@/models/order/hooks";
import PageTitle from "@/ui/PageTitle";

export default function Header() {
    const { data: activeOrdersCount } = useGetActiveOrdersCount();
    return (
        <div className="flex items-center pb-2">
            <PageTitle subTitle="Track your restaurant's performance" title="Dashboard" />
            <div className="flex gap-4 ml-auto items-center bg-white/5 px-4 py-2 rounded-2xl border-blue-500/30 border">
                <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] uppercase tracking-widest font-bold">Live</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <p className="text-[13px] font-medium text-white">{activeOrdersCount} Active {activeOrdersCount > 1 ? "Orders" : "Order"}</p>
            </div>
        </div>
    )
}