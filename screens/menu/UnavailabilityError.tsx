import { useOrderRequestStore } from '@/models/orderRequest/store'
import { MessageCircleWarning } from 'lucide-react'

export default function UnavailabilityError() {
    const { orderRequest, modal, setModal } = useOrderRequestStore()
    const items = orderRequest.items
    if (modal != "error") return null
    const word = items.length <= 1 ? {
        titleA: "One of the item selected is Unavailable",
        titleB: "Remove the item marked red"
    } : {
        titleA: "Some of the items selected are currently Unavailable",
        titleB: "Remove the items marked red"
    }
    const closeModal = () => {
        setModal("cart")
    }

    return (
        <div className='fixed top-0 left-0 bottom-0 right-0 grid place-content-center'>
            <div className="z-300 relative">
                <MessageCircleWarning />
                <p>{word.titleA}</p>
                <p>{word.titleB}</p>
                <button onClick={closeModal}>Ok</button>
            </div>
            <div onClick={closeModal} className="h-full z-10 w-full bg-red-500 absolute top-0 left-0"></div>
        </div>
    )
}
