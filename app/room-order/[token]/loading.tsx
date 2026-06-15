import CategorySkeleton from "@/screens/menu/CategorySkeleton";
import Header from "@/screens/menu/Header";
import { MenuSkeleton } from "@/screens/menu/MenuItemSkeleton";

export default function Loader() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <CategorySkeleton />
            <MenuSkeleton />
        </div>
    )
}
