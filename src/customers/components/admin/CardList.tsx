"use client";
import { useGetAllCustomers } from '@/src/customers/hooks/hooks.api';
import PageInfoCard from '@/src/shared/components/PageInfoCard';
import { Users, UserCheck, Mail, Phone } from 'lucide-react';

export default function CustomerCardList() {
  const { data } = useGetAllCustomers({ page: 0, size: 1000 });
  const customers = data?.content || [];

  const withEmail = customers.filter(c => c.email).length;
  const withPhone = customers.filter(c => c.phoneNumber).length;

  const cards = [
    {
      label: "Total Customers",
      value: customers.length,
      icon: <Users size={14} />,
      colorScheme: {
        bg: "bg-blue-500",
        icon: "text-blue-600",
        value: "text-blue-700",
      },
    },
    {
      label: "With Email",
      value: withEmail,
      icon: <Mail size={14} />,
      colorScheme: {
        bg: "bg-purple-500",
        icon: "text-purple-600",
        value: "text-purple-700",
      },
    },
    {
      label: "With Phone",
      value: withPhone,
      icon: <Phone size={14} />,
      colorScheme: {
        bg: "bg-green-500",
        icon: "text-green-600",
        value: "text-green-700",
      },
    },
    {
      label: "Today",
      value: 0,
      icon: <UserCheck size={14} />,
      colorScheme: {
        bg: "bg-orange-500",
        icon: "text-orange-600",
        value: "text-orange-700",
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