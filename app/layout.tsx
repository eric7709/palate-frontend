import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/provider/Provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Palate – Restaurant | Menu & Online Ordering",
  description: "Order your favorite dishes from Palate. Fast, fresh, and made just for you.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.className}  h-full`}>
        <Providers>
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}