"use client";

import { useState } from "react";
import { useProfile } from "@/context/profile-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateResume } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import type { ResumeBuilderInput } from "@/ai/flows/resume-builder";
import ReactMarkdown from "react-markdown";

const resumeFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  skills: z.string().min(5, "Please list at least one skill."),
  interests: z.string().min(5, "Please list at least one interest."),
  careerPreferences: z.string().optional(),
});

export function ResumeBuilder() {
  const { profile, isProfileComplete } = useProfile();
  const { toast } = useToast();
  const [resume, setResume] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof resumeFormSchema>>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      name: profile.name,
      skills: profile.skills,
      interests: profile.interests,
      careerPreferences: profile.careerPreferences || "",
    },
  });

  async function onSubmit(values: ResumeBuilderInput) {
    setIsLoading(true);
    setResume(null);
    const result = await generateResume(values);

    if (result.success && result.data) {
      setResume(result.data.resume);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate your resume. Please try again.",
      });
    }
    setIsLoading(false);
  }

  if (!isProfileComplete) {
    return (
      <Alert>
        <AlertTitle>Profile Incomplete</AlertTitle>
        <AlertDescription>
          Please complete your profile to generate a resume. Your profile data
          will be used to pre-fill the form below.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Resume Builder</CardTitle>
          <CardDescription>
            Confirm or edit your details below, then generate a professional
            resume in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Priya Sharma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Python, Public Speaking, Graphic Design"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter skills, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Interests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Technology, Education, Healthcare"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter interests, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="careerPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Preferences (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Looking for roles in Bangalore, interested in startups"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any specific preferences for your future career.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generating Resume..." : "Generate My Resume"}
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
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      )}

      {resume && (
        <Card>
          <CardHeader>
            <CardTitle>Your Generated Resume</CardTitle>
            <CardDescription>
              Below is a professional preview of your resume. You can copy the raw markdown from the text area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="border rounded-lg p-6 bg-white dark:bg-card text-card-foreground">
                <article className="prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{resume}</ReactMarkdown>
                </article>
             </div>
             <details>
                <summary className="cursor-pointer text-sm font-medium">View Raw Markdown</summary>
                <Textarea
                    className="mt-2 min-h-[400px] whitespace-pre-wrap font-mono text-xs"
                    value={resume}
                    readOnly
                    />
             </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
