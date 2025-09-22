"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Cloud, Cpu, Database, Server, User } from "lucide-react";

const Box = ({
  icon,
  title,
  subtitle,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-6 text-center shadow-sm ${className}`}
  >
    {icon}
    <h3 className="font-semibold">{title}</h3>
    <p className="text-xs text-muted-foreground">{subtitle}</p>
  </div>
);

const Arrow = () => (
  <div className="flex items-center justify-center">
    <ArrowRight className="h-6 w-6 text-muted-foreground" />
  </div>
);

export function ArchitectureDiagram() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>System Architecture Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-5">
          <Box
            icon={<User className="h-8 w-8 text-primary" />}
            title="Frontend"
            subtitle="Next.js / React"
            className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          />
          <Arrow />
          <Box
            icon={<Server className="h-8 w-8 text-green-500" />}
            title="Backend"
            subtitle="Genkit AI Flows"
            className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          />
          <Arrow />
          <Box
            icon={<Cloud className="h-8 w-8 text-purple-500" />}
            title="Google AI"
            subtitle="Gemini Models"
            className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
          />
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>
            The Next.js frontend communicates with Genkit flows, which leverage
            Google's powerful Gemini AI models to provide intelligent career
            guidance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
