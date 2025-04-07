"use client";

import { usePathname } from "next/navigation";
import MainNavigation from "./MainNavigation";

export default function NavigationWrapper() {
  const pathname = usePathname();
  const showNavigation =
    !pathname?.startsWith("/dashboard") && !pathname?.startsWith("/auth") && !pathname?.startsWith("/login");

  return showNavigation ? <MainNavigation /> : null;
}
