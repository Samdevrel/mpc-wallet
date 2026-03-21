import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPC Wallet | @samdevrel",
  description: "Multi-Party Computation for enterprise-grade key management. Threshold signing, key shards.",
  keywords: ["MPC", "multi-party computation", "wallet", "custody", "threshold signing", "enterprise"],
  authors: [{ name: "Sam", url: "https://x.com/samdevrel" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
