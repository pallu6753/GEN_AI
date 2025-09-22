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
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getJobMarketInsights } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";

const insightsFormSchema = z.object({
  query: z.string().min(10, "Query must be at least 10 characters long."),
});

export function JobMarketInsights() {
  const { toast } = useToast();
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof insightsFormSchema>>({
    resolver: zodResolver(insightsFormSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof insightsFormSchema>) {
    setIsLoading(true);
    setInsights(null);
    const result = await getJobMarketInsights(values);
    if (result.success && result.data) {
      setInsights(result.data.insights);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch job market insights.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Market Insights</CardTitle>
          <CardDescription>
            Ask about emerging job roles and required skills in the Indian market.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'What are the top skills for data scientists in Mumbai?'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be as specific as you like.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Getting Insights..." : "Get Insights"}
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

      {insights && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{insights}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
