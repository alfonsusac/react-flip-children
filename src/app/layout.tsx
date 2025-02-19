import type { Metadata } from "next";
import { Audiowide, Doto, Geist_Mono, Inter, JetBrains_Mono, Lexend, Orbitron } from "next/font/google";
import "./globals.css";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { cn } from "lazy-cn";

const lexend = Lexend({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const digital = Orbitron({
  variable: "--font-digital",
  weight: "700",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--geist-mono",
  subsets: ["latin"],
})

const inter = Inter({
  variable: '--inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "React Flip Children",
  description: "A lightweight FLIP animation library for smoothly reordering children in React, ensuring seamless transitions and improved user experience.",
  authors: [
    {
      name: "Alfonsus Ardani",
      url: "https://github.com/alfonsusac",
    }
  ]
};


function getFontVariable(
  ...fonts: NextFontWithVariable[]
) {
  return cn(fonts.map(font => font.variable))
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          getFontVariable(
            lexend,
            jetbrainsMono,
            digital,
            geistMono,
            inter
          ),
          "antialiased",
          lexend.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
