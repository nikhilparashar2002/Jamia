import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import NavigationWrapper from "@/components/NavigationWrapper";
import MainFooterWrapper from "@/components/MainFooterWrapper";
import ConsultFormWrapper from "@/components/ConsultFormWrapper";
import CssLoader from "@/components/CssLoader";
import "./globals.css";
import MobileConsultCTA from "@/components/MobileConsultCTA"; // Add import


const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jamia Hmdard University Online: Courses, Admission, Fees 2025 ',
  description: 'Start your education journey with Jamia Hamdard University. Use After12th to explore courses, compare colleges, get career advice, and easily apply to Jamia Hamdard for a brighter future.',
  keywords: 'education, college admission, career guidance, university comparison',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="English" className={poppins.className}>
      <head>
        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS for above-the-fold content */
          :root {
            --widgets-spacing: 20px 20px;
          }
          .section {
            box-shadow: rgba(112, 112, 112, 0.5) 0px 0px 10px 0px;
            position: relative;
          }
          /* Add other critical styles here */
        `}} />
        
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          href="/fonts/poppins.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <CssLoader />
        <NavigationWrapper />
        {children}
        <ConsultFormWrapper />
        <MobileConsultCTA /> {/* Add the mobile CTA component */}
        <MainFooterWrapper />
      </body>
    </html>
  );
}
