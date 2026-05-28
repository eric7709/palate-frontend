// app/admin/layout.tsx
import type { Metadata } from "next";
import Sidebar from "@/ui/Sidebar";
import { TopNav } from "@/ui/TopNav";
import ProtectAdmin from "./ProtectAdmin";

export const metadata: Metadata = {
  title: {
    default: "Palate – Restaurant Management",
    template: "%s | Palate",
  },
  description: "Streamline your restaurant operations – orders, menu, tables, and real-time updates, all in one place.",
  keywords: ["restaurant", "POS", "order management", "menu", "dining", "Palate"],
  authors: [{ name: "Palate Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#1a1c21",
  openGraph: {
    title: "Palate – Modern Restaurant Management",
    description: "Efficient order tracking, real-time kitchen updates, and seamless dining experience.",
    type: "website",
    locale: "en_US",
    siteName: "Palate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palate – Restaurant Management",
    description: "Streamline your restaurant operations with Palate.",
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
        <ProtectAdmin>
            <div className="grid grid-cols-[auto_1fr] h-full min-w-250">
                <Sidebar />
                <div className="flex flex-col h-full overflow-hidden">
                    <TopNav />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectAdmin>
    );
}