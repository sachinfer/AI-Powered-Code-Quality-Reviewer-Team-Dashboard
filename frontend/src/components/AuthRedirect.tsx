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
    if (status === "unauthenticated" && !publicPaths.includes(pathname)) {
      router.push("/login");
    }
  }, [status, pathname, router]);

  return null;
} 