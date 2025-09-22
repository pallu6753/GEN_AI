import { Header } from "@/components/header";
import { CurriculumGuidance } from "@/components/curriculum-guidance";

export default function CurriculumPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Curriculum Guidance" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <CurriculumGuidance />
      </main>
    </div>
  );
}
