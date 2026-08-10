import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
});

const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaantanis.com"),
  title: "Kaan Tanış — Designer & Developer",
  description:
    "Arayüzü çizen ve kodu yazan aynı kişi. Full-stack geliştirici ve UI tasarımcısı — fikirden canlıya: strateji, tasarım, geliştirme, teslim.",
  openGraph: {
    title: "Kaan Tanış — Designer & Developer",
    description:
      "İki disiplin, tek kafa. Arayüzü çizen ve kodu yazan aynı kişi.",
    url: "https://kaantanis.com",
    siteName: "kaantanis.com",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
