"use client";
import AuthBar from "../components/AuthBar";
import CodeReviewForm from "../components/CodeReviewForm";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    } else if (status === "authenticated" && session.user?.email) {
      fetch(`http://localhost:8000/users/by-email/${session.user.email}`)
        .then(res => {
          if (res.status === 404) {
            router.push("/register");
          } else {
            setChecked(true);
          }
        });
    }
  }, [status, session, router]);

  if (!checked) return <div className="text-center mt-10">Checking registration...</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full flex justify-end p-4"><AuthBar /></div>
      <h1 className="text-3xl font-bold mb-6">AI Code Reviewer</h1>
      <CodeReviewForm />
    </main>
  );
}
