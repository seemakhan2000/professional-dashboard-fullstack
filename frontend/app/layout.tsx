import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Professional Dashboard",
  description:
    "Professional full-stack business dashboard with analytics and management."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
