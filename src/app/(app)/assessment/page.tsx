import { Header } from "@/components/header";
import { SkillAssessment } from "@/components/skill-assessment";

export default function AssessmentPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Skill Assessment" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <SkillAssessment />
      </main>
    </div>
  );
}
