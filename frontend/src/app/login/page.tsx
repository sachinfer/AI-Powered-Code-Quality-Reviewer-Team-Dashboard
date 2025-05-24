"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={() => signIn("github")}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 font-semibold"
          >
            Sign in with GitHub
          </button>
          <button
            onClick={() => signIn("google")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold"
          >
            Sign in with Google
          </button>
        </div>
        <div className="flex flex-col gap-2 text-center">
          <a href="/manual-login" className="text-blue-400 underline">Manual Login</a>
          <a href="/manual-register" className="text-blue-400 underline">Manual Register</a>
        </div>
      </div>
    </div>
  );
} 