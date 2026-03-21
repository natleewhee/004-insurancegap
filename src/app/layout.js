// app/layout.js
import './globals.css';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import Header from '../components/Header'; // Updated to relative path
import Footer from '../components/Footer'; // Updated to relative path

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
  description: 'Insurance coverage benchmarking for Singaporeans.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
