"use client"
import { TwoMetricCard } from './TwoMetricCard';
import { CheckCircle, Clock, CookingPot, DoorOpen, Table, UtensilsCrossed, XCircle } from 'lucide-react';
import Loader from '@/ui/Loader';
import { loaderStyle } from '@/models/dashboard/style';
import { DashboardSummaryDTO } from '@/models/dashboard/types';

type Props = {
    data: DashboardSummaryDTO | undefined
    isLoading: boolean
}

export default function MetricCards({ data, isLoading }: Props) {

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-4">
                <Loader height='h-40' style={loaderStyle} />
                <Loader height='h-40' style={loaderStyle} />
                <Loader height='h-40' style={loaderStyle} />
            </div>
        )
    }

    const activeOrders = data?.activeOrders ?? { pending: 0, paid: 0 };
    const menuItems = data?.menuItems ?? { active: 0, unavailable: 0 };
    const floorStatus = data?.floorStatus ?? { tables: 0, rooms: 0 };

    return (
        <div className='grid grid-cols-3 gap-4'>
            <TwoMetricCard
                title="Active orders"
                subtitle="Live"
                headerIcon={<Clock className="w-4 h-4" />}
                headerIconBg="bg-indigo-50"
                headerIconColor="text-indigo-600"
                leftMetric={{
                    label: "Pending",
                    value: activeOrders.pending,
                    icon: <CookingPot className="w-3.5 h-3.5" />,
                    bgColor: "bg-amber-50",
                    iconColor: "text-amber-600",
                    valueColor: "text-amber-700",
                }}
                rightMetric={{
                    label: "Paid",
                    value: activeOrders.paid,
                    icon: <CheckCircle className="w-3.5 h-3.5" />,
                    bgColor: "bg-emerald-50",
                    iconColor: "text-emerald-600",
                    valueColor: "text-emerald-700",
                }}
            />
            <TwoMetricCard
                title="Menu items"
                subtitle="Status"
                headerIcon={<UtensilsCrossed className="w-4 h-4" />}
                headerIconBg="bg-emerald-50"
                headerIconColor="text-emerald-600"
                leftMetric={{
                    label: "Active",
                    value: menuItems.active,
                    icon: <CheckCircle className="w-3.5 h-3.5" />,
                    bgColor: "bg-pink-100",
                    iconColor: "text-emerald-600",
                    valueColor: "text-emerald-700",
                }}
                rightMetric={{
                    label: "Unavailable",
                    value: menuItems.unavailable,
                    icon: <XCircle className="w-3.5 h-3.5" />,
                    bgColor: "bg-blue-50",
                    iconColor: "text-neutral-500",
                    valueColor: "text-neutral-600",
                }}
            />
            <TwoMetricCard
                title="Floor status"
                subtitle="Count"
                headerIcon={<DoorOpen className="w-4 h-4" />}
                headerIconBg="bg-indigo-50"
                headerIconColor="text-indigo-600"
                leftMetric={{
                    label: "Tables",
                    value: floorStatus.tables,
                    icon: <Table className="w-3.5 h-3.5" />,
                    bgColor: "bg-green-50",
                    iconColor: "text-neutral-500",
                    valueColor: "text-neutral-900",
                }}
                rightMetric={{
                    label: "Rooms",
                    value: floorStatus.rooms,
                    icon: <DoorOpen className="w-3.5 h-3.5" />,
                    bgColor: "bg-cyan-100",
                    iconColor: "text-neutral-500",
                    valueColor: "text-neutral-900",
                }}
            />
        </div>
    )
}