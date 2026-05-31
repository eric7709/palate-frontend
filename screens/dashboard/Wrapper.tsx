import Title from './Title'
import Card from './Card'

type Props = {
    data: {
        title: {
            text: string
            icon: any
        }
        cardItems: {
            label: string
            count: number
            amount: number
            percentage: number
            icon: any
        }[]
    }
}




export default function Wrapper({ data: { cardItems, title } }: Props) {
    return (
        <div className='text-white border bg-linear-to-b from-gray-950  to-gray-800 border-white rounded-xl'>
            <Title title={title} />
            <div className="p-3 space-y-2">
                {cardItems.map((el) => (
                    <Card data={el} />
                ))}
            </div>
        </div>
    )
}
