"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManualRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/teams/")
      .then((res) => res.json())
      .then(setTeams);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("http://localhost:8000/manual/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, team_id: teamId }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/manual-login");
    } else {
      const data = await res.json();
      setError(data.detail || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Manual Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input type="text" className="border rounded p-2 w-full text-black" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" className="border rounded p-2 w-full text-black" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" className="border rounded p-2 w-full text-black" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Select Team</label>
          <select className="border rounded p-2 w-full text-black" value={teamId} onChange={e => setTeamId(e.target.value)} required>
            <option value="">-- Select a team --</option>
            {teams.map((team: any) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-300">Already have an account? <a href="/manual-login" className="text-blue-400 underline">Login</a></div>
    </div>
  );
} 