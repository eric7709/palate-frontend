"use client"
import { MenuItemSkeleton, SharedHeader } from "@/src/orders";
import { CategorySkeleton } from "@/src/orders/components/browse/categories/CategorySkeleton";

export default function Loader() {
    return (
        <div className="min-h-screen bg-gray-50">
            <SharedHeader />
            <CategorySkeleton />
            <MenuItemSkeleton />
        </div>
    )
}
