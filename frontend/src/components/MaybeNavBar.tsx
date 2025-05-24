"use client";
import NavBar from "./NavBar";
import { usePathname } from "next/navigation";

export default function MaybeNavBar() {
  const pathname = usePathname();
  const hideNav = ["/login", "/manual-login", "/manual-register"].includes(pathname);
  if (hideNav) return null;
  return <NavBar />;
} 