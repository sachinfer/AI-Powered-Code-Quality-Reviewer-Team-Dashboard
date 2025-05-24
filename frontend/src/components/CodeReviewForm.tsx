"use client";
import React, { useState } from "react";

const TABS = [
  { key: "pylint", label: "Pylint (Quality)", info: "Checks code quality, style, and common errors." },
  { key: "bandit", label: "Bandit (Security)", info: "Scans for security issues in Python code." },
  { key: "black", label: "Black (Formatting)", info: "Checks if code is formatted according to Black's style." },
  { key: "ai", label: "AI Suggestions", info: "AI-powered review, explanations, and docstring generation." },
];

const getScore = (result: string, key: string) => {
  if (!result) return null;
  if (key === "pylint") {
    const match = result.match(/rated at ([\d.]+)\/(10|10.0)/);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  if (key === "bandit") {
    const issues = (result.match(/Issue:/g) || []).length;
    return issues === 0 ? 10 : Math.max(0, 10 - issues);
  }
  if (key === "black") {
    if (result.includes("would reformat")) return 5;
    if (result.includes("would not reformat")) return 10;
    return 0;
  }
  return null;
};

const getScoreColor = (score: number | null) => {
  if (score === null) return "bg-gray-300";
  if (score >= 8) return "bg-green-500";
  if (score >= 5) return "bg-yellow-400";
  return "bg-red-500";
};

const CodeReviewForm = () => {
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pylint");
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCode("");
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setAiFeedback(null);
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      const blob = new Blob([code], { type: "text/x-python" });
      formData.append("file", blob, "code.py");
    }
    try {
      const res = await fetch("http://localhost:8000/analyze/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Error submitting code." });
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = async (tabKey: string) => {
    setActiveTab(tabKey);
    if (tabKey === "ai" && !aiFeedback && (code || file)) {
      setAiLoading(true);
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else {
        const blob = new Blob([code], { type: "text/x-python" });
        formData.append("file", blob, "code.py");
      }
      try {
        const res = await fetch("http://localhost:8000/ai-review/", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setAiFeedback(data.ai_feedback);
      } catch (err) {
        setAiFeedback("Error fetching AI feedback.");
      } finally {
        setAiLoading(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-300"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Code Review</h2>
      <textarea
        className="w-full border border-gray-400 rounded p-2 min-h-[120px] text-gray-900 bg-gray-50 focus:outline-blue-500"
        placeholder="Paste your Python code here..."
        value={code}
        onChange={handleCodeChange}
        disabled={!!file}
      />
      <div className="flex items-center gap-2">
        <input type="file" accept=".py" onChange={handleFileChange} className="text-gray-900" />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
          disabled={loading || (!code && !file)}
        >
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </div>
      <div className="mt-4">
        <label className="block text-gray-800 font-semibold mb-1">Analysis Results:</label>
        <div className="flex gap-2 mb-2">
          {TABS.map((tab) => {
            const score = result ? getScore(result[tab.key], tab.key) : null;
            return (
              <div key={tab.key} className="relative flex flex-col items-center">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-t font-semibold border-b-2 focus:outline-none ${
                    activeTab === tab.key
                      ? "border-blue-600 text-blue-700 bg-blue-50"
                      : "border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTabClick(tab.key)}
                  onMouseEnter={() => setShowInfo(tab.key)}
                  onMouseLeave={() => setShowInfo(null)}
                >
                  {tab.label}
                  <span className="ml-1 text-xs text-gray-400 cursor-help">&#9432;</span>
                </button>
                {showInfo === tab.key && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 bg-white border border-gray-300 rounded shadow-md p-2 text-xs w-48 text-gray-700">
                    {tab.info}
                  </div>
                )}
                {score !== null && tab.key !== "ai" && (
                  <div className="w-24 h-2 mt-1 rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${getScoreColor(score)}`}
                      style={{ width: `${(score / 10) * 100}%` }}
                    ></div>
                  </div>
                )}
                {score !== null && tab.key !== "ai" && (
                  <span className="text-xs text-gray-700 mt-1">{score}/10</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="bg-gray-100 border border-gray-300 p-3 rounded min-h-[120px] text-gray-800 whitespace-pre-wrap text-sm overflow-x-auto">
          {activeTab === "ai"
            ? aiLoading
              ? "Loading AI suggestions..."
              : aiFeedback || "AI suggestions will appear here after you submit your code and select this tab."
            : result && result[activeTab]
            ? result[activeTab]
            : result && result.error
            ? result.error
            : "Results will appear here after you submit your code."}
        </div>
      </div>
    </form>
  );
};

export default CodeReviewForm; 