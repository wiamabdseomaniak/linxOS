import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "LINXOS - Logistics & Sponsoring Platform",
  description: "Enterprise-grade logistics and delivery management platform for modern businesses",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%237C3AED' rx='20' width='100' height='100'/><text x='50' y='65' font-size='40' font-family='Arial' font-weight='bold' fill='white' text-anchor='middle'>LX</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)} data-scroll-behavior="smooth">
      <body className={`${inter.variable} min-h-full font-sans antialiased`}>
        <ThemeProvider>
          <TooltipProvider>
            <Providers>{children}</Providers>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}