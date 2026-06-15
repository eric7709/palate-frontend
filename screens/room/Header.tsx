"use client"
import PageTitle from '@/ui/PageTitle';
import AddButton from '@/ui/AddButton';
import { useRoomStore } from '@/models/room/store';


export default function Header() {
    const { setModal } = useRoomStore()
    return (
        <div className="flex items-center justify-between">
            <PageTitle subTitle="Manage your restaurant rooms" title="Rooms" />
            <AddButton title="Add Room" onClick={() => setModal("CREATE")} />
        </div>
    );
}