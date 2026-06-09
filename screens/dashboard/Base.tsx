import RecentOrderTable from './RecentOrderTable'
import TopCategories from './TopCategories'
import TopMenuItems from './TopMenuItems'
import TopTables from './TopTables'
import Header from './Header'
import OrderAnalytics from './OrderAnalytics'

export default function Base() {
    return (
        <div className='p-4 space-y-4'>
            <Header />
            <OrderAnalytics />
            <div className="grid grid-cols-3 gap-3">
                <TopMenuItems />
                <TopCategories />
                <TopTables />
            </div>
            <RecentOrderTable />
        </div>
    )
}
