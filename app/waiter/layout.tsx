// app/cashier/layout.tsx
import type { Metadata } from "next";
import CashierNav from "../../screens/cashierNav/CashierNav";
import ProtectCashier from "./ProtectWaiter";
import WaiterNav from "@/screens/waiterNav/WaiterNav";

export const metadata: Metadata = {
  title: {
    default: "Palate – Waiter Dashboard",
    template: "%s | Palate Waiter",
  },
  description: "Manage orders and customer interactions efficiently.",
  keywords: ["waiter", "POS", "orders", "restaurant", "Palate"],
  authors: [{ name: "Palate Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#1a1c21",
  openGraph: {
    title: "Palate – Waiter Dashboard",
    description: "Efficiently manage orders and customer interactions.",
    type: "website",
    locale: "en_US",
    siteName: "Palate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palate – Waiter Dashboard",
    description: "Manage restaurant orders and customer interactions with ease.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <ProtectCashier>
        <WaiterNav />
      </ProtectCashier>
      {children}
    </div>
  );
}