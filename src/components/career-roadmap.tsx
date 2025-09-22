"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Circle, Map } from "lucide-react";

const roadmapSteps = [
  {
    title: "Master Foundational Skills",
    description: "Complete courses in Python, Statistics, and SQL.",
    completed: true,
  },
  {
    title: "Learn Machine Learning",
    description: "Take advanced courses in ML algorithms and frameworks.",
    completed: true,
  },
  {
    title: "Build a Portfolio",
    description: "Complete 3-5 projects showcasing your skills.",
    completed: false,
  },
  {
    title: "Specialize and Network",
    description: "Focus on an area like NLP or CV and attend meetups.",
    completed: false,
  },
  {
    title: "Apply for Jobs",
    description: "Start applying for Data Scientist roles.",
    completed: false,
  },
];

export function CareerRoadmap() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Map className="size-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Career Roadmap: Data Scientist</CardTitle>
        </div>
        <CardDescription>
          Your personalized steps to becoming a Data Scientist.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {roadmapSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-4">
              {step.completed ? (
                <CheckCircle className="size-5 text-green-500 mt-1 shrink-0" />
              ) : (
                <Circle className="size-5 text-muted-foreground mt-1 shrink-0" />
              )}
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
