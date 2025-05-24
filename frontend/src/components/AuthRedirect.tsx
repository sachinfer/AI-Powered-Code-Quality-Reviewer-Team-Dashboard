"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ["/login", "/manual-login", "/manual-register"];
    const manualAuth = typeof window !== "undefined" && localStorage.getItem("manual_auth") === "true";
    if ((status === "authenticated" || manualAuth) && pathname === "/login") {
      router.replace("/");
    }
    if (status === "unauthenticated" && !manualAuth && !publicPaths.includes(pathname)) {
      router.push("/login");
    }
  }, [status, pathname, router]);

  return null;
} 