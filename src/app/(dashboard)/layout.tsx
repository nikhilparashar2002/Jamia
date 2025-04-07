'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import Link from "next/link";
import { signOut } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const isAdmin = session?.user?.role === 'admin';
  const displayName = session?.user?.name || session?.user?.email;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
          <p className="text-xl font-medium text-gray-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Navbar className="border-b bg-white/70 backdrop-blur-md shadow-sm">
        <NavbarContent className="gap-6" justify="start">
          <NavbarItem>
            <Link
              href="/dashboard"
              className="font-medium hover:text-primary transition-colors duration-200 flex items-center gap-2 text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </Link>
          </NavbarItem>
          {isAdmin && (
            <>
              <NavbarItem>
                <Link
                  href="/dashboard/writers"
                  className="font-medium hover:text-primary transition-colors duration-200 flex items-center gap-2 text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Writers
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="/dashboard/leads"
                  className="font-medium hover:text-primary transition-colors duration-200 flex items-center gap-2 text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13.828 4.929a1 1 0 011.414 0l5.657 5.657a1 1 0 010 1.414l-5.657 5.657a1 1 0 01-1.414-1.414L17.657 12H4a1 1 0 110-2h13.657l-3.829-3.829a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Leads
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="/dashboard/trending"
                  className="font-medium hover:text-primary transition-colors duration-200 flex items-center gap-2 text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Trending
                </Link>
              </NavbarItem>
            </>
          )}
          <NavbarItem>
            <Link
              href="/dashboard/seo"
              className="font-medium hover:text-primary transition-colors duration-200 flex items-center gap-2 text-foreground"
              prefetch={true}
              replace={true}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              SEO Content
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {displayName} - ({session?.user?.role})
            </span>
          </NavbarItem>
          <NavbarItem>
            <Button
              color="danger"
              variant="flat"
              size="sm"
              onPress={handleSignOut}
              className="font-medium hover:bg-danger-200 transition-colors duration-200"
              startContent={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              }
            >
              Sign Out
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
