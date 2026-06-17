"use client"
import { MenuItemSkeleton } from "@/src/ordering";
import { CategorySkeleton } from "@/src/ordering/components/categories/CategorySkeleton";
import { Header } from "@/src/ordering/components/shared/Header";

export default function Loader() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <CategorySkeleton />
            <MenuItemSkeleton />
        </div>
    )
}
