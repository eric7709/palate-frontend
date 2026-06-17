import React from 'react'

export function CashierNavTotal({amount}: {amount?: number}) {
    return (
        <div className="border-l text-center border-white/10 pl-4">
            <p className="text-base font-semibold text-green-600">₦{(amount || 0).toLocaleString()}</p>
        </div>
    )
}
