import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/provider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: 'Elims — Thoughtful Everyday Wear',
    template: '%s | Elims'
  },
  description:
    'Thoughtfully designed pieces for every rhythm of everyday life.',
  keywords: [
    'Luxury fashion',
    'Editorial fashion',
    'Elims',
    'Designer clothing',
    'Luxury e-commerce',
    'Fashion boutique',
    'Contemporary fashion',
    'Luxury accessories',
    'Online fashion store',
    'Premium apparel'
  ],
  openGraph: {
    title: 'Elims — Thoughtful Everyday Wear',
    description:
      'Thoughtfully designed pieces for every rhythm of everyday life.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elims — Thoughtful Everyday Wear',
    description:
      'Thoughtfully designed pieces for every rhythm of everyday life.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (    
    <html lang="en">
      <body className="bg-white text-dark-brown font-sans antialiased overflow-x-hidden">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
