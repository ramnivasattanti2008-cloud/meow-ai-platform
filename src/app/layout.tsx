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
  authors: [{ name: 'Ram Nivas Attanti', url: 'https://github.com/ramnivasattanti2008-cloud' }],
  creator: 'Ram Nivas Attanti',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://meowai.tech'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://meowai.tech',
    title: 'MEOW AI — Your Business. Reimagined with AI.',
    description:
      'AI that does the work, not just talks about the work. Multilingual voice agents in Telugu and English, custom workflow automation, and marketing operations.',
    siteName: 'MEOW AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEOW AI — AI Automation & Multilingual Voice Platform',
    description: 'Transforming Indian SMB operations with multilingual voice agents and deterministic workflow automation.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

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
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

