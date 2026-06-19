"use client"
import PageTitle from '@/src/shared/components/utils/PageTitle';
import AddButton from '@/src/shared/components/utils/AddButton';
import { useCategoryStore } from '@/src/categories/store';

type Props = {
    onAddClick?: () => void;
};

export  function Header({ onAddClick }: Props) {
    const { setModal } = useCategoryStore()
    return (
        <div className="flex items-center justify-between">
            <PageTitle subTitle="Manage your restaurant categories" title="Categories" />
            <AddButton title="Add Category" onClick={() => setModal("createCategory")} />
        </div>
    );
}