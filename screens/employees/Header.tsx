"use client"
import PageTitle from '@/ui/PageTitle';
import AddButton from '@/ui/AddButton';
import { useEmployeeStore } from '@/models/employee/store';


export default function Header() {
    const { setModal } = useEmployeeStore()
    return (
        <div className="flex items-center justify-between">
            <PageTitle subTitle="Manage your restaurant employees" title="Employees" />
            <AddButton title="Add Employee" onClick={() => setModal("createEmployee")} />
        </div>
    );
}