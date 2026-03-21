// app/layout.js
import './globals.css';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-body', 
  weight: ['400', '500', '600', '700'] 
});

const dmSerif = DM_Serif_Display({ 
  subsets: ['latin'], 
  variable: '--font-display', 
  weight: ['400'] 
});

export const metadata = {
  title: 'InsureCheck — A Coah Project',
  description: 'Insurance coverage benchmarking for Singaporeans. Get your Insurance Score in 3 minutes — free, neutral, no agent involved.',
  keywords: ['insurance Singapore', 'insurance coverage check', 'InsureCheck', 'Coah'],
  openGraph: {
    title: 'InsureCheck — Free Insurance Coverage Check for Singaporeans',
    description: 'Score your insurance coverage in 3 minutes. Free, neutral, no sign-up required.',
    url: 'https://sginsurecheck.vercel.app',
    siteName: 'InsureCheck by Coah',
    locale: 'en_SG',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
