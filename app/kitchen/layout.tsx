import type { Metadata } from "next";
import ProtectKitchen from "@/src/shared/provider/ProtectKitchen";
import { KitchenNav } from "@/src/kitchen/KitchenNav";

export const metadata: Metadata = {
  title: {
    default: "Palate – Kitchen Dashboard",
    template: "%s | Palate Kitchen",
  },
  description: "Track incoming orders, manage preparation status, and keep the kitchen running smoothly.",
  keywords: ["kitchen", "chef", "cook", "baker", "orders", "restaurant", "Palate"],
  authors: [{ name: "Palate Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#1a1c21",
  openGraph: {
    title: "Palate – Kitchen Dashboard",
    description: "Real-time order tracking for kitchen staff.",
    type: "website",
    locale: "en_US",
    siteName: "Palate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palate – Kitchen Dashboard",
    description: "Manage kitchen orders with ease.",
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
      <ProtectKitchen>
        <KitchenNav />
        {children}
      </ProtectKitchen>
    </div>
  );
}