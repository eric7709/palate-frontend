import React from 'react'

type Props = {
    title: {
        text: string
        icon: any
    }
}

export default function Title({ title: { icon, text } }: Props) {
    return (
        <div className='flex p-3 border-b items-center text-sm justify-between '>
            <p className='font-semibold'>{text}</p>
            <p>{icon}</p>
        </div>
    )
}
