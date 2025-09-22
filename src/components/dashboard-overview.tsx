"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/context/profile-context";
import { assessSkills, recommendCareerPaths } from "@/lib/actions";
import type { SkillAssessmentOutput } from "@/ai/flows/skill-assessment";
import type { RecommendCareerPathsOutput } from "@/ai/flows/career-path-recommendations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Star, Target, TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Link from "next/link";
import { Button } from "./ui/button";
import { ProgressCalendar } from "./progress-calendar";
import { CareerRoadmap } from "./career-roadmap";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function DashboardOverview() {
  const { profile, isProfileComplete } = useProfile();
  const [assessment, setAssessment] = useState<SkillAssessmentOutput | null>(
    null
  );
  const [recommendations, setRecommendations] =
    useState<RecommendCareerPathsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!isProfileComplete) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);

      const [assessmentResult, recommendationsResult] = await Promise.all([
        assessSkills({
          questionnaireAnswers: `Based on my profile: Skills are ${profile.skills}, interests are ${profile.interests}.`,
        }),
        recommendCareerPaths({
          skills: profile.skills,
          interests: profile.interests,
        }),
      ]);

      if (assessmentResult.success && assessmentResult.data) {
        setAssessment(assessmentResult.data);
      } else {
        setError(
          (prev) => (prev || "") + " " + assessmentResult.error
        );
      }

      if (
        recommendationsResult.success &&
        recommendationsResult.data
      ) {
        setRecommendations(recommendationsResult.data);
      } else {
        setError(
          (prev) => (prev || "") + " " + recommendationsResult.error
        );
      }
      setIsLoading(false);
    }
    fetchData();
  }, [profile, isProfileComplete]);

  if (!isProfileComplete && !isLoading) {
    return (
      <Alert>
        <AlertTitle>Welcome to Pallavi!</AlertTitle>
        <AlertDescription>
          Please complete your profile to unlock your personalized career
          dashboard.
          <Button asChild className="mt-4">
            <Link href="/profile">Go to Profile</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96 lg:col-span-2" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading dashboard</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="xl:col-span-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            <CardTitle className="text-lg font-semibold">
              Skill Proficiency
            </CardTitle>
          </div>
          <CardDescription>{assessment?.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          {assessment?.skillScores && assessment.skillScores.length > 0 && (
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart
                  data={assessment.skillScores}
                  layout="vertical"
                  margin={{ left: 10, right: 10 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="score"
                    radius={[0, 4, 4, 0]}
                    fill="var(--color-score)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
      <Card className="xl:col-span-1">
        <CardHeader>
            <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                <CardTitle className="text-lg font-semibold">Top Career Paths</CardTitle>
            </div>
          <CardDescription>
            Based on your skills and interests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations?.careerPaths.map((path) => (
              <Card key={path.path}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {path.path}
                  </CardTitle>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < path.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted stroke-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {path.reasoning}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
       <Card className="xl:col-span-1">
        <ProgressCalendar />
      </Card>
      <div className="lg:col-span-2 xl:col-span-3">
        <CareerRoadmap />
      </div>
    </div>
  );
}
