"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateInterviewQuestions, evaluateAnswer } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";
import { MessageSquare, Lightbulb } from "lucide-react";
import { Textarea } from "./ui/textarea";

const interviewFormSchema = z.object({
  careerPath: z.string().min(3, "Please enter a valid career path."),
});

type Feedback = {
  feedback: string;
  isLoading: boolean;
};

export function MockInterview() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, Feedback>>({});

  const form = useForm<z.infer<typeof interviewFormSchema>>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      careerPath: "",
    },
  });

  async function onSubmit(values: z.infer<typeof interviewFormSchema>) {
    setIsLoading(true);
    setQuestions(null);
    setAnswers({});
    setFeedbacks({});
    const result = await generateInterviewQuestions({
      ...values,
      questionCount: 5,
    });

    if (result.success && result.data) {
      setQuestions(result.data.questions);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate interview questions.",
      });
    }
    setIsLoading(false);
  }

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleGetFeedback = async (index: number) => {
    const question = questions?.[index];
    const answer = answers[index];
    if (!question || !answer) {
      toast({
        variant: "destructive",
        title: "Please answer the question first.",
      });
      return;
    }

    setFeedbacks((prev) => ({
      ...prev,
      [index]: { feedback: "", isLoading: true },
    }));

    const result = await evaluateAnswer({ question, answer });
    if (result.success && result.data) {
      setFeedbacks((prev) => ({
        ...prev,
        [index]: { feedback: result.data.feedback, isLoading: false },
      }));
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get feedback.",
      });
       setFeedbacks((prev) => ({
        ...prev,
        [index]: { ...prev[index], isLoading: false },
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mock Interview</CardTitle>
          <CardDescription>
            Get interview questions for a career path to practice your skills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="careerPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Path</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Software Engineer'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the role you want to practice for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generating Questions..." : "Generate Questions"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>
      )}

      {questions && (
        <Card>
          <CardHeader>
            <CardTitle>Your Interview Questions</CardTitle>
            <CardDescription>Answer the questions below and get AI-powered feedback.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {questions.map((q, index) => (
                <div key={index} className="space-y-4">
                   <div className="flex items-start gap-3">
                        <MessageSquare className="size-5 text-primary shrink-0 mt-1"/>
                        <p className="font-semibold">{q}</p>
                    </div>
                  <Textarea
                    placeholder="Your answer..."
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={() => handleGetFeedback(index)}
                    disabled={feedbacks[index]?.isLoading}
                    variant="outline"
                  >
                    {feedbacks[index]?.isLoading ? "Getting Feedback..." : "Get Feedback"}
                  </Button>
                  {feedbacks[index]?.isLoading && (
                    <div className="space-y-2 mt-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                  )}
                  {feedbacks[index]?.feedback && !feedbacks[index]?.isLoading && (
                    <div className="mt-4 rounded-md border bg-muted/50 p-4">
                      <h4 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="size-5 text-yellow-400"/> Feedback</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{feedbacks[index].feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
