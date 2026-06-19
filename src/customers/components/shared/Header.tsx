"use client"

import PageTitle from '@/src/shared/components/utils/PageTitle'
import AddButton from '@/src/shared/components/utils/AddButton'
import { useCustomerStore } from '@/src/customers/store'

export default function Header() {
    const { setModal } = useCustomerStore()
    return (
        <div className='flex items-center justify-between'>
            <PageTitle subTitle='Manage your restaurant customers' title='Customers' />
            <AddButton title="Add Customer" onClick={() => setModal("createCustomer")} />
        </div>
    )
}