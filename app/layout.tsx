import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShowSettle - Tour Settlement Calculator",
  description: "Settle shows in 30 seconds. Calculate splits, track expenses, and vote on new features. Built by AI, guided by you.",
  keywords: ["tour settlement", "show settlement calculator", "concert settlement", "tour manager", "settlement sheet"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
