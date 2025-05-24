"use client";
import React, { useState } from "react";

const CodeReviewForm = () => {
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setResult(data.analysis);
    } catch (err) {
      setResult("Error submitting code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Code Review</h2>
      <textarea
        className="w-full border rounded p-2 min-h-[120px]"
        placeholder="Paste your Python code here..."
        value={code}
        onChange={handleCodeChange}
        disabled={!!file}
      />
      <div className="flex items-center gap-2">
        <input type="file" accept=".py" onChange={handleFileChange} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || (!code && !file)}
        >
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </div>
      {result && (
        <pre className="bg-gray-100 p-2 rounded mt-4 whitespace-pre-wrap text-sm">{result}</pre>
      )}
    </form>
  );
};

export default CodeReviewForm; 