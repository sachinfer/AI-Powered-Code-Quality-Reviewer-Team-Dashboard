"use client";
import Link from "next/link";
import AuthBar from "./AuthBar";

export default function NavBar() {
  return (
    <nav className="w-full flex items-center justify-between bg-white border-b px-6 py-3 mb-6">
      <div className="flex gap-4 items-center">
        <Link href="/" className="text-lg font-bold text-blue-700 hover:underline">Home</Link>
        <Link href="/team-dashboard" className="text-lg font-bold text-blue-700 hover:underline">Team Dashboard</Link>
      </div>
      <AuthBar />
    </nav>
  );
} 