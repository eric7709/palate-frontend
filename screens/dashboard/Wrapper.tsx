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
        <div className='text-white bg-linear-to-br from-blue-500/20 to-gray-950 border-blue-500/30 border rounded-xl'>
            <Title title={title} />
            <div className="p-3 space-y-2">
                {cardItems.map((el, index) => (
                    <Card data={el} key={index} />
                ))}
            </div>
        </div>
    )
}
