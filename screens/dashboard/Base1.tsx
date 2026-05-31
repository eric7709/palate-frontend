import CardList from './CardList'
import Table from './Table'
import TopCategories from './TopCategories'
import TopMenuItems from './TopMenuItems'
import TopTables from './TopTables'
import Header from './Header'

export default function Base1() {

    return (
        <div className='p-4 space-y-4'>
            <Header />
            <CardList />
            <div className="grid grid-cols-3 gap-3">
                <TopMenuItems />
                <TopCategories />
                <TopTables />
            </div>
            <Table />
        </div>
    )
}
