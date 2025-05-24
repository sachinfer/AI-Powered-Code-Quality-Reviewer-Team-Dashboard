"use client";
import React, { useEffect, useState } from "react";

interface Team {
  id: number;
  name: string;
}
interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
}
interface Review {
  id: number;
  user_id: number;
  code: string;
  language: string;
  pylint: string;
  bandit: string;
  black: string;
  ai_feedback: string;
  created_at: string;
}

export default function TeamDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/teams/")
      .then((res) => res.json())
      .then(setTeams);
  }, []);

  const selectTeam = async (team: Team) => {
    setSelectedTeam(team);
    setLoading(true);
    const [membersRes, reviewsRes] = await Promise.all([
      fetch(`http://localhost:8000/teams/${team.id}/members`).then((r) => r.json()),
      fetch(`http://localhost:8000/teams/${team.id}/reviews`).then((r) => r.json()),
    ]);
    setMembers(membersRes);
    setReviews(reviewsRes);
    setLoading(false);
  };

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    await fetch("http://localhost:8000/teams/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTeamName }),
    });
    setNewTeamName("");
    // Refresh teams
    fetch("http://localhost:8000/teams/")
      .then((res) => res.json())
      .then(setTeams);
  };

  // Team analytics
  const teamReviewCount = reviews.length;
  const teamMemberCount = members.length;
  const avgPylint =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => {
            const match = r.pylint.match(/rated at ([\d.]+)\/(10|10.0)/);
            return sum + (match ? parseFloat(match[1]) : 0);
          }, 0) / reviews.length
        ).toFixed(2)
      : "-";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Team:</label>
        <select
          className="border rounded p-2"
          onChange={(e) => {
            const team = teams.find((t) => t.id === Number(e.target.value));
            if (team) selectTeam(team);
          }}
          value={selectedTeam?.id || ""}
        >
          <option value="">-- Select a team --</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <form onSubmit={createTeam} className="inline-block mr-4">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="New team name"
            className="border rounded p-2 mr-2"
          />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Create Team</button>
        </form>
      </div>
      {loading && <div>Loading team data...</div>}
      {selectedTeam && !loading && (
        <div>
          <div className="mb-4 flex gap-8">
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="text-xs text-gray-500">Team Members</div>
              <div className="text-2xl font-bold text-blue-700">{teamMemberCount}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="text-xs text-gray-500">Total Reviews</div>
              <div className="text-2xl font-bold text-green-700">{teamReviewCount}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="text-xs text-gray-500">Avg. Pylint Score</div>
              <div className="text-2xl font-bold text-yellow-700">{avgPylint}</div>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Members</h2>
          <ul className="mb-4">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-2 mb-1">
                {m.avatar_url && (
                  <img src={m.avatar_url} alt="avatar" className="w-6 h-6 rounded-full border" />
                )}
                <span>{m.name || m.email}</span>
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-bold mb-2">Team Code Reviews</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">User</th>
                <th className="border p-2">Language</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Pylint</th>
                <th className="border p-2">Bandit</th>
                <th className="border p-2">Black</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => {
                const user = members.find((m) => m.id === r.user_id);
                const getScore = (txt: string) => {
                  const match = txt.match(/rated at ([\d.]+)\/(10|10.0)/);
                  return match ? match[1] : "-";
                };
                return (
                  <tr key={r.id}>
                    <td className="border p-2">{user ? user.name || user.email : r.user_id}</td>
                    <td className="border p-2">{r.language}</td>
                    <td className="border p-2">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="border p-2">{getScore(r.pylint)}</td>
                    <td className="border p-2">{r.bandit.includes("No issues identified") ? "10" : "<10"}</td>
                    <td className="border p-2">{r.black.includes("would not reformat") ? "10" : "<10"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 