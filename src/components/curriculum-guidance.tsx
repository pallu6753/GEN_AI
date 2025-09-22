"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useProfile } from "@/context/profile-context";
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
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getCurriculumRecommendations } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const curriculumFormSchema = z.object({
  targetCareerPaths: z
    .string()
    .min(5, "Please enter at least one target career."),
});

export function CurriculumGuidance() {
  const { profile, isProfileComplete } = useProfile();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof curriculumFormSchema>>({
    resolver: zodResolver(curriculumFormSchema),
    defaultValues: {
      targetCareerPaths: "",
    },
  });

  async function onSubmit(values: z.infer<typeof curriculumFormSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    const studentProfile = `Skills: ${profile.skills}. Interests: ${profile.interests}. Preferences: ${profile.careerPreferences}`;
    const result = await getCurriculumRecommendations({
      ...values,
      studentProfile,
    });
    if (result.success && result.data) {
      setRecommendations(result.data.recommendedCurriculum);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch curriculum recommendations.",
      });
    }
    setIsLoading(false);
  }

  if (!isProfileComplete) {
    return (
      <Alert>
        <AlertTitle>Profile Incomplete</AlertTitle>
        <AlertDescription>
          Please complete your profile to get personalized curriculum guidance.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Guidance</CardTitle>
          <CardDescription>
            Get a personalized learning plan for your dream career.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="targetCareerPaths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Career Path(s)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Data Scientist, AI Engineer'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter one or more careers, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Generating Plan..."
                  : "Generate Learning Plan"}
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
            </CardContent>
        </Card>
      )}

      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Curriculum</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">
              {recommendations}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
