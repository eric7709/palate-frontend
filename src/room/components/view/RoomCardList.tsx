"use client";
import { useGetAllRoomsNoPagination } from '@/src/room/hooks/hooks.api';
import PageInfoCard from '@/src/shared/components/utils/PageInfoCard';
import { DoorOpen, CheckCircle2, XCircle, Layers } from 'lucide-react';

export default function RoomCardList() {
  const rooms = useGetAllRoomsNoPagination();

  const total = rooms.length;
  const active = rooms.filter(r => r.status == "AVAILABLE").length;
  const inactive = rooms.filter(r => r.status == "UNAVAILABLE").length;
  const floors = new Set(rooms.map(r => r.floor).filter(f => f !== null)).size;

  const cards = [
    {
      label: "Total Rooms",
      value: total,
      icon: <DoorOpen size={14} />,
      colorScheme: {
        bg: "bg-blue-500",
        icon: "text-blue-600",
        value: "text-blue-700",
      },
    },
    {
      label: "Active",
      value: active,
      icon: <CheckCircle2 size={14} />,
      colorScheme: {
        bg: "bg-emerald-500",
        icon: "text-emerald-600",
        value: "text-emerald-700",
      },
    },
    {
      label: "Inactive",
      value: inactive,
      icon: <XCircle size={14} />,
      colorScheme: {
        bg: "bg-gray-500",
        icon: "text-gray-600",
        value: "text-gray-700",
      },
    },
    {
      label: "Floors",
      value: floors,
      icon: <Layers size={14} />,
      colorScheme: {
        bg: "bg-purple-500",
        icon: "text-purple-600",
        value: "text-purple-700",
      },
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map((card) => (
        <PageInfoCard
          key={card.label}
          data={{
            label: card.label,
            value: card.value,
            unit: "",
            icon: card.icon,
          }}
          bg={card.colorScheme.bg}
          iconColor={card.colorScheme.icon}
          valueColor={card.colorScheme.value}
        />
      ))}
    </div>
  );
}