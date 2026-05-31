import PageTitle from "@/ui/PageTitle";
import { ArrowLeftRight, Calendar } from "lucide-react";

export default function Header() {
    return (
        <div className="flex">
            <PageTitle subTitle="Track your restaurants performance" title="Dashboard"/>
            <div className="flex gap-3 font-semibold ml-auto items-center">
                <div className="px-4 py-2.5 shadow bg-blue-600 cursor-pointer duration-300 active:scale-90 shadow-gray-300 text-xs gap-2 w-fit text-white flex items-center rounded-full border border-white">
                    <Calendar size={15} />
                    <p>20-04-2026</p>
                </div>
                <ArrowLeftRight size={17} color="white"/>
                <div className="px-4 py-2.5 shadow bg-red-600 cursor-pointer duration-300 active:scale-90 shadow-gray-300 text-xs gap-2 w-fit text-white flex items-center rounded-full border border-white">
                    <Calendar size={15} />
                    <p>20-04-2026</p>
                </div>
            </div>
        </div>
    )
}
