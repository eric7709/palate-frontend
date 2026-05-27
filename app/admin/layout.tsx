import Sidebar from "@/ui/Sidebar";
import { TopNav } from "@/ui/TopNav";
import ProtectAdmin from "./ProtectAdmin";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectAdmin>
            <div className="grid grid-cols-[auto_1fr] h-full">
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


