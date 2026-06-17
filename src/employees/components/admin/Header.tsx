"use client"
import PageTitle from '@/src/shared/components/PageTitle';
import AddButton from '@/src/shared/components/AddButton';
import { useEmployeeStore } from '@/src/employees';


export  function Header() {
    const { setModal } = useEmployeeStore()
    return (
        <div className="flex items-center justify-between">
            <PageTitle subTitle="Manage your restaurant employees" title="Employees" />
            <AddButton title="Add Employee" onClick={() => setModal("createEmployee")} />
        </div>
    );
}