import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

export const metadata = {
  metadataBase: new URL('https://sginsurecheck.vercel.app'),
  title: {
    default: 'InsureCheck by Coah — Know if you\'re truly covered',
    template: '%s | InsureCheck by Coah',
  },
  description: 'A free Coah tool. Get your Insurance Score in 3 minutes — benchmarked against Singapore financial planning guidelines. No sign-up. No agent. No data stored.',
  keywords: [
    'insurance score Singapore',
    'am I underinsured Singapore',
    'critical illness coverage Singapore',
    'insurance gap checker',
    'MediShield Life integrated shield plan',
    'how much CI coverage do I need',
    'insurance health check Singapore',
    'InsureCheck',
  ],
  authors: [{ name: 'InsureCheck' }],
  creator: 'InsureCheck',
  publisher: 'InsureCheck',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'https://sginsurecheck.vercel.app',
    siteName: 'InsureCheck',
    title: 'InsureCheck by Coah — Know if you\'re truly covered',
    description: 'A free Coah tool. Get your Insurance Score in 3 minutes. No agent. No sign-up. Free.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InsureCheck — Your free Insurance Score',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsureCheck by Coah — Know if you\'re truly covered',
    description: 'A free Coah tool. Get your Insurance Score in 3 minutes. Benchmarked against Singapore financial planning guidelines.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://sginsurecheck.vercel.app',
  },
  verification: {
    google: 'Y_nV-b_siexhomZSFAP3XX4zIzOUwUwue4WQ1UFK7eI',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-SG">
      <body className={`${dmSans.variable} ${dmSerif.variable}`}>
        {children}
      </body>
    </html>
  )
}