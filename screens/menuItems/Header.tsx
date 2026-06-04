"use client"
import PageTitle from '@/ui/PageTitle'
import AddButton from '../../ui/AddButton'
import { useMenuItemStore } from '@/models/menuItem/store'

export default function Header() {
    const {setModal} = useMenuItemStore()
    return (
        <div className='flex items-center justify-between'>
            <PageTitle subTitle='Manage your restaurant menu items' title='Menu Items' />
            <AddButton onClick={() => setModal("createMenuItem")} title='Add Menu Item'/>
        </div>
    )
}
