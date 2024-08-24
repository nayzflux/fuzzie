import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";
import { cn } from "~/lib/utils";
import QueryProvider from "~/providers/query-provider";
import ThemeProvider from "~/providers/theme-provider";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
const gabarito = Gabarito({ subsets: ["latin"] });

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
      <body className={cn("min-h-screen", gabarito.className)}>
        <ThemeProvider>
          <QueryProvider>
            <Toaster />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
