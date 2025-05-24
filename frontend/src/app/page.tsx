import CodeReviewForm from "../components/CodeReviewForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">AI Code Reviewer</h1>
      <CodeReviewForm />
    </main>
  );
}
