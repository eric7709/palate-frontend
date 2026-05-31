import Wrapper from './Wrapper'
import { Crown, Table } from 'lucide-react'

export default function TopTables() {
    const data = {
        title: {
            text: "Top Tables",
            icon: <Table size={14} />
        },
        cardItems: [
            {
                label: "Table 1",
                count: 45,
                amount: 2550,
                percentage: 85,
                icon: <Crown size={16} />
            },
            {
                label: "Table 3",
                count: 42,
                amount: 2220,
                percentage: 25,
                icon: <Crown size={16} />
            },
        ]
    }
    return <Wrapper data={data} />
}
