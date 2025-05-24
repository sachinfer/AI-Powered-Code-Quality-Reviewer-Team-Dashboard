"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/teams/")
      .then((res) => res.json())
      .then(setTeams);
  }, []);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in first.</div>;

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: session.user?.name,
        email: session.user?.email,
        avatar_url: session.user?.image,
        team_id: selectedTeam,
      }),
    });
    setLoading(false);
    router.push("/team-dashboard");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister}>
        <div className="mb-4 flex items-center gap-3">
          {session.user?.image && (
            <img src={session.user.image} alt="avatar" className="w-12 h-12 rounded-full border" />
          )}
          <div>
            <div className="font-semibold">{session.user?.name}</div>
            <div className="text-gray-400 text-sm">{session.user?.email}</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Select Team</label>
          <select
            className="border rounded p-2 w-full text-black"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            required
          >
            <option value="">-- Select a team --</option>
            {teams.map((team: any) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
} 