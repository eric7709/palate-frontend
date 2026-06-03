import PageTitle from '@/ui/PageTitle'
import AddButton from '../../ui/AddButton'
import { useTableStore } from '@/models/restaurantTable/store'

export default function Header() {
    const {setModal} = useTableStore()
    return (
        <div className='flex items-center justify-between'>
            <PageTitle subTitle='Manage your restaurant tables' title='Tables' />
            <AddButton onClick={() => setModal("createTable")} title='Add Table'/>
        </div>
    )
}
