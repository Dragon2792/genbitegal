import { getStorageUrl } from "@/lib/storageUrl";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "GenBI Tegal - Energi Untuk Negeri",
    template: "%s | GenBI Tegal",
  },
  description:
    "Generasi Baru Indonesia Tegal - Komunitas penerima beasiswa program pendidikan kebanksentralan yang berkomitmen memberikan energi untuk negeri.",
  keywords: ["GenBI", "Tegal", "Bank Indonesia", "Beasiswa", "Mahasiswa"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://genbitegal.com",
    siteName: "GenBI Tegal",
  },
  icons: {
    icon: "/assets/images/47068785c61b3f0ada39c664e1e18b11.png",
  },
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="overflow-x-hidden" suppressHydrationWarning>
      <body className="overflow-x-hidden" suppressHydrationWarning>
        <NextTopLoader color="#0056b3" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
