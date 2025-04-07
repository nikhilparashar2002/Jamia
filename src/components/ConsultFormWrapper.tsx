"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ConsultForm from "./ConsultForm";

export default function ConsultFormWrapper() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide on protected paths
  const showForm =
    !pathname?.startsWith("/dashboard") &&
    !pathname?.startsWith("/auth") &&
    !pathname?.startsWith("/login");

  // Open form after 40 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 40000);
    return () => clearTimeout(timer);
  }, []);

  if (!showForm) return null;

  return (
    <ConsultForm
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}
