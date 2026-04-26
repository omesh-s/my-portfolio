import type { Metadata } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import { BlackHoleBackdrop } from "@/components/BlackHoleBackdrop";
import { CursorAura } from "@/components/CursorAura";
import { StarsCanvas } from "@/components/StarsCanvas";
import { SingularityBackground } from "@/components/SingularityBackground";

const sora = Sora({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Omesh — Portfolio",
  description:
    "Cinematic, high-performance portfolio for an engineer/builder. Next.js + TypeScript + GSAP + R3F.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <StarsCanvas />
        {/* Black hole shader layer (above stars) */}
        <SingularityBackground
          className="fixed inset-0"
          offset={{ x: -0.34, y: 0.02 }}
          intensity={0.95}
          tint={[1.05, 0.72, 1.25]}
        />
        <BlackHoleBackdrop />
        <CursorAura />
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
