"use client"
import AddButton from '@/src/shared/components/utils/AddButton'
import PageTitle from '@/src/shared/components/utils/PageTitle'
import { useTableStore } from '@/src/tables/store'

export default function Header() {
    const {setModal} = useTableStore()
    return (
        <div className='flex items-center justify-between'>
            <PageTitle subTitle='Manage your restaurant tables' title='Tables' />
            <AddButton onClick={() => setModal("createTable")} title='Add Table'/>
        </div>
    )
}
