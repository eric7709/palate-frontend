import CashierNav from "../../screens/cashierNav/CashierNav";
import ProtectCashier from "./ProtectCashier";

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


