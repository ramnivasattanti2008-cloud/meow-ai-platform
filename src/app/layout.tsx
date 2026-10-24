import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MEOW AI — Business Reimagined with AI | Voice & Workflow Automation',
  description:
    'MEOW AI builds intelligent multilingual voice agents (Telugu & English), automated business workflows, and AI growth engines for Indian SMBs, startups, and service businesses.',
  keywords: [
    'AI voice agents',
    'Telugu AI voice agent',
    'business process automation',
    'SMB AI solutions India',
    'Anthropic Claude startup',
    'workflow automation Bengaluru',
    'MEOW AI',
  ],
  authors: [{ name: 'MeowBoxAI Inc.', url: 'https://meowboxai.tech' }],
  creator: 'MeowBoxAI Inc.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://meowboxai.tech'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://meowboxai.tech',
    title: 'MEOW AI — One AI. Every part of life and work.',
    description:
      'AI that turns instructions into verified outcomes. Conversational assistant, multilingual voice agents, and deterministic workflow automation.',
    siteName: 'MEOW AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEOW AI — One AI. Every part of life and work.',
    description: 'Autonomous AI execution engine combining conversational assistant, multilingual voice, and workflow automation.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { MeowConcierge } from '@/components/common/MeowConcierge';
import { CommandPaletteModal } from '@/components/common/CommandPaletteModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-white/20 selection:text-white">
        {children}
        <MeowConcierge />
        <CommandPaletteModal />
      </body>
    </html>
  );
}

