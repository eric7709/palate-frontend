"use client"
import { MenuItemSkeleton, SharedHeader } from "@/src/ordering";
import { CategorySkeleton } from "@/src/ordering/components/categories/CategorySkeleton";

export default function Loader() {
    return (
        <div className="min-h-screen bg-gray-50">
            <SharedHeader />
            <CategorySkeleton />
            <MenuItemSkeleton />
        </div>
    )
}
