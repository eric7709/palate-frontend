import React from 'react'

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="border shadow-md shadow-gray-200 space-y-4 p-3 rounded-3xl border-gray-200">
            {children}
        </div>
    )
}
