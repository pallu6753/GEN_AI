"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/context/profile-context";
import type { UserProfile } from "@/lib/types";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name must be less than 50 characters."),
  skills: z.string().min(5, "Please list at least one skill."),
  interests: z.string().min(5, "Please list at least one interest."),
  careerPreferences: z.string().optional(),
});

export function ProfileForm() {
  const { profile, setProfile } = useProfile();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      skills: profile.skills,
      interests: profile.interests,
      careerPreferences: profile.careerPreferences || "",
    },
  });

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    setProfile(values as UserProfile);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          This information helps us personalize your career recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    Enter your skills, separated by commas.
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
                    Enter your interests, separated by commas.
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
                    Any specific preferences you have for your future career.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
