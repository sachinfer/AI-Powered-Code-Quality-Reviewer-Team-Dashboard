"use client";
import React, { useState } from "react";

const TABS = [
  { key: "pylint", label: "Pylint (Quality)" },
  { key: "bandit", label: "Bandit (Security)" },
  { key: "black", label: "Black (Formatting)" },
];

const CodeReviewForm = () => {
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pylint");

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
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.key}
              className={`px-3 py-1 rounded-t font-semibold border-b-2 focus:outline-none ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-gray-100 border border-gray-300 p-3 rounded min-h-[120px] text-gray-800 whitespace-pre-wrap text-sm overflow-x-auto">
          {result && result[activeTab]
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