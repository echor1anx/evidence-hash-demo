"use client";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Don't show navbar on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <AuthProvider>
      {!isAuthPage && <Navbar />}
      {children}
    </AuthProvider>
  );
}
