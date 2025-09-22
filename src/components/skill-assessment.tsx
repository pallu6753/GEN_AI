"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { assessSkills } from "@/lib/actions";
import type { SkillAssessmentOutput } from "@/ai/flows/skill-assessment";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { ThumbsUp, ThumbsDown, Sparkles, MessageCircleQuestion } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const assessmentFormSchema = z.object({
  questionnaireAnswers: z
    .string()
    .min(20, "Please provide more detailed answers."),
  transcript: z.any().optional(),
});

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function SkillAssessment() {
  const { toast } = useToast();
  const [assessmentResult, setAssessmentResult] =
    useState<SkillAssessmentOutput | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof assessmentFormSchema>>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      questionnaireAnswers: "",
    },
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof assessmentFormSchema>) {
    setIsLoading(true);
    setAssessmentResult(null);
    setSubmittedAnswers(null);

    let transcriptDataUri: string | undefined;
    const file = values.transcript?.[0];

    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a transcript smaller than 4MB.",
        });
        setIsLoading(false);
        return;
      }
      try {
        transcriptDataUri = await fileToDataUri(file);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error reading file",
          description: "Could not process the uploaded transcript file.",
        });
        setIsLoading(false);
        return;
      }
    }

    const result = await assessSkills({
      questionnaireAnswers: values.questionnaireAnswers,
      transcriptDataUri,
    });

    if (result.success && result.data) {
      setAssessmentResult(result.data);
      setSubmittedAnswers(values.questionnaireAnswers);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get your skill assessment.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skill Assessment</CardTitle>
          <CardDescription>
            Answer the questions below and optionally upload your transcript to
            get an AI-powered skill analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="questionnaireAnswers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Questionnaire</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="1. Describe a project you are proud of...\n2. What technical skills are you most confident in?...\n3. What soft skills do you think are your strongest?..."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Answer the questions as thoroughly as possible.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transcript"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Transcript (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        {...form.register("transcript")}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload your academic transcript for a more detailed
                      analysis (PDF, DOC, TXT, max 4MB).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Assess My Skills"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-4 pt-4">
              <div className="w-1/2 space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="w-1/2 space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {assessmentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary size-6" />
              Your Assessment Results
            </CardTitle>
            <CardDescription>{assessmentResult.summary}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-8">
            {submittedAnswers && (
                <div className="md:col-span-2 space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MessageCircleQuestion className="size-5" />
                        Your Answers
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-line text-sm">{submittedAnswers}</p>
                </div>
            )}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <ThumbsUp className="text-green-500 size-5" />
                Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {assessmentResult.strengths.map((strength) => (
                  <Badge key={strength} variant="secondary" className="text-base">
                    {strength}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 mt-6">
                <ThumbsDown className="text-red-500 size-5" />
                Areas for Improvement
              </h3>
              <div className="flex flex-wrap gap-2">
                {assessmentResult.weaknesses.map((weakness) => (
                  <Badge key={weakness} variant="outline" className="text-base">
                    {weakness}
                  </Badge>
                ))}
              </div>
            </div>
            {assessmentResult.skillScores &&
              assessmentResult.skillScores.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Skill Proficiency
                  </h3>
                   <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer>
                      <BarChart data={assessmentResult.skillScores} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                        <XAxis
                          dataKey="skill"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                         <YAxis domain={[0, 10]} />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
