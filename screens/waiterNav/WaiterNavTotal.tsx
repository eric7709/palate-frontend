export default function WaiterNavTotal({amount}: {amount?: number}) {
    return (
        <div className="border-l text-center border-white/10 pl-4">
            <p className="text-base font-semibold text-white">₦{(amount || 0).toLocaleString()}</p>
        </div>
    )
}
