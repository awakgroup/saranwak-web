import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Saranwak - Rekomendasi Tempat di Padang",
  description:
    "Cari coffee shop, tempat nugas, tempat nongkrong, dan destinasi lokal terbaik di Padang berdasarkan mood dan kebutuhanmu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body className="bg-[#FAF7F2] text-zinc-900 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}