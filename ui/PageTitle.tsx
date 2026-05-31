type Props = {
    title: string
    subTitle: string
}
export default function PageTitle({ title, subTitle }: Props) {
    return (
        <div className="">
            <p className='text-[18px] text-white font-semibold'>{title}</p>
            <p className='text-gray-400 text-xs'>{subTitle}</p>
        </div>
    )
}
