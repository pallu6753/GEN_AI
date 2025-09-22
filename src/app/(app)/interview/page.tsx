import { Header } from "@/components/header";
import { MockInterview } from "@/components/mock-interview";

export default function InterviewPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Mock Interview" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <MockInterview />
      </main>
    </div>
  );
}
