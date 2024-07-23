import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";
import QueryProvider from "~/providers/query-provider";
import ThemeProvider from "~/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fuzzie - Webhook delivery platform",
  description: "Deliver fast, secure and reliable Webhooks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <Toaster />
            <div className="w-screen min-h-screen overflow-hidden">
              {children}
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
