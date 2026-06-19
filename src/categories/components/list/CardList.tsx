"use client";
import { useGetAllCategories } from '@/src/categories/hooks/hooks.api';
import { useGetAllMenuItems } from '@/src/menuItems/hooks/hooks.api';
import PageInfoCard from '@/src/shared/components/utils/PageInfoCard';
import { LayoutGrid, UtensilsCrossed, CheckCircle, XCircle } from 'lucide-react';

export function CardList() {
  const { data: categories } = useGetAllCategories();
  const { data: menuItems } = useGetAllMenuItems({ size: 1000 });

  const available = categories?.content?.filter(el => el.status === "AVAILABLE").length ?? 0;
  const unavailable = categories?.content?.filter(el => el.status === "UNAVAILABLE").length ?? 0;

  const cards = [
    {
      label: "Total Categories",
      value: categories?.content?.length ?? 0,
      icon: <LayoutGrid size={14} />,
      colorScheme: {
        bg: "bg-indigo-500",
        icon: "text-indigo-600",
        value: "text-indigo-700",
      },
    },
    {
      label: "Total Menu Items",
      value: menuItems?.content?.length ?? 0,
      icon: <UtensilsCrossed size={14} />,
      colorScheme: {
        bg: "bg-emerald-500",
        icon: "text-emerald-600",
        value: "text-emerald-700",
      },
    },
    {
      label: "Available",
      value: available,
      icon: <CheckCircle size={14} />,
      colorScheme: {
        bg: "bg-green-500",
        icon: "text-green-600",
        value: "text-green-700",
      },
    },
    {
      label: "Unavailable",
      value: unavailable,
      icon: <XCircle size={14} />,
      colorScheme: {
        bg: "bg-rose-500",
        icon: "text-rose-600",
        value: "text-rose-700",
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