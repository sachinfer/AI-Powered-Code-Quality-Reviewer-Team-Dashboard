import ClientSessionProvider from "../components/ClientSessionProvider";
import AuthBar from "../components/AuthBar";
import CodeReviewForm from "../components/CodeReviewForm";

export default function Home() {
  return (
    <ClientSessionProvider>
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-full flex justify-end p-4"><AuthBar /></div>
        <h1 className="text-3xl font-bold mb-6">AI Code Reviewer</h1>
        <CodeReviewForm />
      </main>
    </ClientSessionProvider>
  );
}
