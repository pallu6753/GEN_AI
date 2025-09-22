import { Header } from "@/components/header";
import { CareerRecommendations } from "@/components/career-recommendations";

export default function RecommendationsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Career Recommendations" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <CareerRecommendations />
      </main>
    </div>
  );
}
