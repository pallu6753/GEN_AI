import { Header } from "@/components/header";
import { JobMarketInsights } from "@/components/job-market-insights";

export default function InsightsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Job Market Insights" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <JobMarketInsights />
      </main>
    </div>
  );
}
