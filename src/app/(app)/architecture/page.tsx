import { Header } from "@/components/header";
import { ArchitectureDiagram } from "@/components/architecture-diagram";

export default function ArchitecturePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Application Architecture" />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:gap-6 lg:p-6">
        <ArchitectureDiagram />
      </main>
    </div>
  );
}
