import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jorden Shaw | Eldorado Gold Decision Dashboard",
  description: "Investment decision dashboard for Eldorado Gold Corporation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
