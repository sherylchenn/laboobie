import { SimpleAudioPlayer } from "@/components/audio-player/simple-audio-player";
import { Header } from "@/components/header";
import { GlobalModals } from "@/components/modals/global-modals";
import { MusicBanner } from "@/components/music-banner";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Waldenburg, WaldenburgHF } from "@/utils/fonts";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

export const metadata: Metadata = {
  title: "Showcase | ElevenLabs",
  description: "The best projects built with ElevenLabs",
  icons: [
    {
      rel: "icon",
      url: "https://storage.googleapis.com/eleven-public-cdn/images/speech-directory/favicon.ico",
    },
  ],
  openGraph: {
    title: "Showcase | ElevenLabs",
    description: "The best projects built with ElevenLabs",
    url: "https://showcase.elevenlabs.io",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://storage.googleapis.com/eleven-public-cdn/images/speech-directory/og.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://storage.googleapis.com/eleven-public-cdn/images/speech-directory/og.png",
        width: 1800,
        height: 1600,
      },
    ],
  },
  twitter: {
    title: "Showcase | ElevenLabs",
    description: "The best projects built with ElevenLabs",
    images: [
      {
        url: "https://storage.googleapis.com/eleven-public-cdn/images/speech-directory/og.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://storage.googleapis.com/eleven-public-cdn/images/speech-directory/og.png",
        width: 1800,
        height: 1600,
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    // { media: "(prefers-color-scheme: light)" },
    { media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        `${GeistSans.variable} ${GeistMono.variable} ${Waldenburg.variable} ${WaldenburgHF.variable}`,
        "whitespace-pre-line antialiased bg-background text-foreground !dark",
      )}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            {/* Fixed global background layers */}

            <Header />
            {children}

            <MusicBanner />
            <Toaster />
            <GlobalModals />
            <SimpleAudioPlayer />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
