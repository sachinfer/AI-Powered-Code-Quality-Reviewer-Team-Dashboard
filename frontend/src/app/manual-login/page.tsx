"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("http://localhost:8000/manual/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      if (res.status === 401 && (data.detail === "Invalid credentials" || data.detail === "User not found")) {
        alert("This user does not exist in our system. Please register first.");
      }
      setError(data.detail || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Manual Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" className="border rounded p-2 w-full text-black" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" className="border rounded p-2 w-full text-black" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-300">Don't have an account? <a href="/manual-register" className="text-blue-400 underline">Register</a></div>
    </div>
  );
} 