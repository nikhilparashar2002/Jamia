"use client";

import { usePathname } from "next/navigation";
import MainFooter from "./MainFooter";

export default function MainFooterWrapper() {
  const pathname = usePathname();
  const showFooter =
    !pathname?.startsWith("/dashboard") && !pathname?.startsWith("/auth") && !pathname?.startsWith("/login");

  return showFooter ? <MainFooter /> : null;
}
