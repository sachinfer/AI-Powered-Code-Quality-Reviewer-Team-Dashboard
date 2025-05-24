"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";

export default function AuthBar() {
  const { data: session, status } = useSession();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // You get user info here: result.user
      alert(`Signed in as ${result.user.email}`);
      // TODO: Send user info to backend for registration/login
    } catch (error) {
      alert("Google sign-in failed");
    }
  };

  if (status === "loading") {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => signIn("github")}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 font-semibold"
        >
          Sign in with GitHub
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold"
        >
          Sign in with Google
        </button>
      </div>
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