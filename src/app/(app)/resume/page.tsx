import { Header } from "@/components/header";
import { ResumeBuilder } from "@/components/resume-builder";

export default function ResumePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Resume Builder" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <ResumeBuilder />
      </main>
    </div>
  );
}
