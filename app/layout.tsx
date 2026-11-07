import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sweet-16-miah-banda.vercel.app"),
  title: "Miah Alana · Sweet 16 · 30 de Enero 2027",
  description:
    "Invitación digital al Sweet 16 de Miah Alana Banda · 30 de enero de 2027 · La Puente, CA.",
  openGraph: {
    title: "Miah Alana · Sweet 16",
    description: "30 de enero de 2027 · La Puente, CA.",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Miah Alana · Sweet 16" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${greatVibes.variable} ${cormorant.variable} ${lato.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
