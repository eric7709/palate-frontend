import React from 'react'

export default function CashierNavTotal({amount}: {amount?: number}) {
    return (
        <div className="border-l text-center border-white/10 pl-4">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Total Sales</p>
            <p className="text-sm font-semibold text-white">₦{(amount || 0).toLocaleString()}</p>
        </div>
    )
}
