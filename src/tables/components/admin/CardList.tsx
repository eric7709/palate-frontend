"use client";
import { useGetAllTables } from '@/src/tables/hooks/hooks.api';
import PageInfoCard from '@/src/shared/components/PageInfoCard';
import { TableProperties, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TableCardList() {
  const { data } = useGetAllTables({ page: 0, size: 1000 });
  const tables = data?.content || [];

  const total = tables.length;
  const available = tables.filter(t => t.status === "AVAILABLE").length;
  const occupied = tables.filter(t => t.status === "OCCUPIED").length;
  const reserved = tables.filter(t => t.status === "RESERVED").length;

  const cards = [
    {
      label: "Total Tables",
      value: total,
      icon: <TableProperties size={14} />,
      colorScheme: {
        bg: "bg-blue-500",
        icon: "text-blue-600",
        value: "text-blue-700",
      },
    },
    {
      label: "Available",
      value: available,
      icon: <CheckCircle size={14} />,
      colorScheme: {
        bg: "bg-emerald-500",
        icon: "text-emerald-600",
        value: "text-emerald-700",
      },
    },
    {
      label: "Occupied",
      value: occupied,
      icon: <XCircle size={14} />,
      colorScheme: {
        bg: "bg-red-500",
        icon: "text-red-600",
        value: "text-red-700",
      },
    },
    {
      label: "Reserved",
      value: reserved,
      icon: <Clock size={14} />,
      colorScheme: {
        bg: "bg-amber-500",
        icon: "text-amber-600",
        value: "text-amber-700",
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