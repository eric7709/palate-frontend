"use client"
import PageTitle from '@/ui/PageTitle';
import AddButton from '@/ui/AddButton';
import { useCategoryStore } from '@/models/category/store';

type Props = {
    onAddClick?: () => void;
};

export default function Header({ onAddClick }: Props) {
    const { setModal } = useCategoryStore()
    return (
        <div className="flex items-center justify-between">
            <PageTitle subTitle="Manage your restaurant categories" title="Categories" />
            <AddButton title="Add Category" onClick={() => setModal("createCategory")} />
        </div>
    );
}