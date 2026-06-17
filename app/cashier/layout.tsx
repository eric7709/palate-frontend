import type { Metadata } from "next";
import ProtectCashier from "../../src/shared/provider/ProtectCashier";
import { CashierNav } from "@/src/cashiers/components/nav/CashierNav";

export const metadata: Metadata = {
  title: {
    default: "Palate – Cashier Dashboard",
    template: "%s | Palate Cashier",
  },
  description: "Manage payments, process orders, and handle customer transactions efficiently.",
  keywords: ["cashier", "POS", "payments", "orders", "restaurant", "Palate"],
  authors: [{ name: "Palate Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#1a1c21",
  openGraph: {
    title: "Palate – Cashier Dashboard",
    description: "Fast and secure payment processing for your restaurant.",
    type: "website",
    locale: "en_US",
    siteName: "Palate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palate – Cashier Dashboard",
    description: "Manage restaurant payments with ease.",
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
        <div className="flex flex-col min-w-250">
            <ProtectCashier>
                <CashierNav />
            </ProtectCashier>
            {children}
        </div>
    );
}