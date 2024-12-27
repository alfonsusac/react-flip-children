import type { Metadata } from "next";
import { Audiowide, Doto, Geist_Mono, JetBrains_Mono, Lexend, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Lexend({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const digital = Orbitron({
//   variable: "--font-digital",
//   weight: "400",
// })
const digital = Orbitron({
  variable: "--font-digital",
  weight: "700",
  subsets: ["latin"],
})


export const metadata: Metadata = {
  title: "React Array FLIP Animation",
  description: "A FLIP animation for reordering arrays in React",
  authors: [
    {
      name: "Alfonsus Ardani",
      url: "https://github.com/alfonsusac",
    }
  ]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${digital.variable} antialiased ${geistSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
