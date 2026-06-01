import PageTitle from '@/ui/PageTitle'
import AddButton from '../../ui/AddButton'
import { useCategoryStore } from '@/models/category/store'

export default function Header() {
    const {} = useCategoryStore()
    return (
        <div className='flex items-center justify-between'>
            <PageTitle subTitle='Manage your restaurant categories' title='Categories' />
            <AddButton title='Add Category'/>
        </div>
    )
}
