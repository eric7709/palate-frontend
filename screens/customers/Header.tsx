"use client"

import PageTitle from '@/ui/PageTitle'
import AddButton from '@/ui/AddButton'
import { useCustomerStore } from '@/models/customer/store'

export default function Header() {
    const { setModal } = useCustomerStore()
    return (
        <div className='flex items-center justify-between'>
            <PageTitle subTitle='Manage your restaurant customers' title='Customers' />
            <AddButton title="Add Customer" onClick={() => setModal("createCustomer")} />
        </div>
    )
}