import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "证见 · 贵州茅台个股研究工作台",
  description: "沿着证据理解公司。事实、推断与未知分开展示的个股诊断工作台。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
