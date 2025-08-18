import { SimpleAudioPlayer } from "@/components/audio-player/simple-audio-player";
import { Banner } from "@/components/banner";
import { Header } from "@/components/header";
import { GlobalModals } from "@/components/modals/global-modals";
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
  title: "Speech Directory | ElevenLabs",
  description: "Listen to the best speech samples by ElevenLabs v3",
  icons: [
    {
      rel: "icon",
      url: "https://storage.googleapis.com/eleven-public-cdn/images/speech-directory/favicon.ico",
    },
  ],
  openGraph: {
    title: "Speech Directory | ElevenLabs",
    description: "Listen to the best speech samples by ElevenLabs v3",
    url: "https://speech.directory",
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
    title: "Speech Directory | ElevenLabs",
    description: "Listen to the best speech samples by ElevenLabs v3",
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
            <Header />
            {children}

            <Banner />
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
