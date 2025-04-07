'use client';

import Navigation from "@/components/MainNavigation";
import Footer from "@/components/MainFooter";
import { usePathname } from 'next/navigation';

export default function AuthorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <Navigation />
      <div key={pathname}>
        {children}
      </div>
      <Footer />
    </>
  );
}
