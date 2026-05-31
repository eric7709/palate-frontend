import PageTitle from '@/ui/PageTitle'
import AddButton from '../../ui/AddButton'

export default function Header() {
    return (
        <div className='flex items-center justify-between'>
            <PageTitle subTitle='Manage your employees' title='Employee' />
            <AddButton title='Add Employee' />
        </div>
    )
}
