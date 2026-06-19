"use client"
import PageTitle from '@/src/shared/components/utils/PageTitle'
import { useMenuItemStore } from '@/src/menuItems/store'
import AddButton from '@/src/shared/components/utils/AddButton'

export function Header() {
    const {setModal} = useMenuItemStore()
    return (
        <div className='flex items-center justify-between'>
            <PageTitle subTitle='Manage your restaurant menu items' title='Menu Items' />
            <AddButton onClick={() => setModal("createMenuItem")} title='Add Menu Item'/>
        </div>
    )
}
