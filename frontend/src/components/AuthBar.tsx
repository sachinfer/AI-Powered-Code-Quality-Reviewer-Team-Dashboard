"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthBar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("github")}
        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 font-semibold"
      >
        Sign in with GitHub
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt="avatar"
          className="w-8 h-8 rounded-full border"
        />
      )}
      <span className="text-gray-800 font-medium">{session.user?.name || session.user?.email}</span>
      <button
        onClick={() => signOut()}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-semibold"
      >
        Sign out
      </button>
    </div>
  );
} 