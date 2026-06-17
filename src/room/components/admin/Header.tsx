"use client"
import PageTitle from '@/src/shared/components/PageTitle';
import AddButton from '@/src/shared/components/AddButton';
import { useRoomStore } from '@/src/room/store';


export default function Header() {
    const { setModal } = useRoomStore()
    return (
        <div className="flex items-center justify-between">
            <PageTitle subTitle="Manage your restaurant rooms" title="Rooms" />
            <AddButton title="Add Room" onClick={() => setModal("CREATE")} />
        </div>
    );
}