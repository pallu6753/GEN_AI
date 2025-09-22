"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/context/profile-context";
import {
  recommendCareerPaths,
  analyzeSkillsGap,
  suggestLearningResources,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, Lightbulb, BookMarked, ChevronDown } from "lucide-react";
import { RecommendCareerPathsOutput } from "@/ai/flows/career-path-recommendations";


type SkillsGap = {
  skillsGap: string;
  suggestedSkillsToLearn: string;
};

type LearningResources = {
  resources: string[];
};

export function CareerRecommendations() {
  const { profile, isProfileComplete } = useProfile();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<RecommendCareerPathsOutput | null>(null);
  const [skillsGap, setSkillsGap] = useState<Record<string, SkillsGap | null>>({});
  const [learningResources, setLearningResources] = useState<Record<string, LearningResources | null>>({});
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async () => {
    if (!isProfileComplete) {
      setError("Please complete your profile to get recommendations.");
      return;
    }
    setIsLoadingRecs(true);
    setError(null);
    const result = await recommendCareerPaths({
      skills: profile.skills,
      interests: profile.interests,
    });
    if (result.success && result.data) {
      setRecommendations(result.data);
    } else {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch career recommendations.",
      });
    }
    setIsLoadingRecs(false);
  };

  useEffect(() => {
    if(isProfileComplete) {
        getRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileComplete]);

  const getDetails = async (careerPath: string) => {
    if (skillsGap[careerPath]) return; // Already fetched

    setIsLoadingDetails((prev) => ({ ...prev, [careerPath]: true }));
    const skillsGapResult = await analyzeSkillsGap({
      studentSkills: profile.skills,
      careerPath,
    });
    
    if (skillsGapResult.success && skillsGapResult.data) {
      setSkillsGap((prev) => ({ ...prev, [careerPath]: skillsGapResult.data }));
      
      const resourcesResult = await suggestLearningResources({
        skillsGap: skillsGapResult.data.skillsGap,
        careerPath,
      });

      if (resourcesResult.success && resourcesResult.data) {
        setLearningResources((prev) => ({ ...prev, [careerPath]: resourcesResult.data }));
      } else {
        toast({ variant: "destructive", title: "Could not fetch learning resources." });
      }
    } else {
      toast({ variant: "destructive", title: "Could not analyze skills gap." });
    }
    setIsLoadingDetails((prev) => ({ ...prev, [careerPath]: false }));
  };

  if (!isProfileComplete && !isLoadingRecs) {
    return (
        <Alert>
            <AlertTitle>Profile Incomplete</AlertTitle>
            <AlertDescription>Please complete your profile to get career recommendations.</AlertDescription>
        </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoadingRecs) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-40" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Career Paths</h2>
            <p className="text-muted-foreground">{recommendations?.summary || 'AI-generated career path suggestions based on your profile.'}</p>
        </div>
        <Button onClick={getRecommendations} disabled={isLoadingRecs}>
            Refresh Recommendations
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {recommendations?.careerPaths.map((rec, index) => (
          <AccordionItem value={`item-${index}`} key={rec.path} className="border-0 bg-card rounded-lg shadow-sm">
             <AccordionTrigger 
                className="flex w-full items-center justify-between p-6 text-lg font-semibold hover:no-underline"
                onClick={() => getDetails(rec.path)}
             >
              <div className="flex items-center gap-3 text-left">
                <Rocket className="size-6 text-primary shrink-0" />
                <span>{rec.path}</span>
              </div>
              <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
             </AccordionTrigger>
              <AccordionContent>
                <div className="p-6 pt-0">
                    <p className="text-muted-foreground mb-4">{rec.reasoning}</p>
                    {isLoadingDetails[rec.path] && (
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-6 w-1/4 mt-4" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    )}
                    {skillsGap[rec.path] && (
                        <div className="space-y-6 border-t pt-6">
                            <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Lightbulb className="size-5 text-yellow-400"/>Skills Gap Analysis</h3>
                                <p className="text-muted-foreground">{skillsGap[rec.path]?.skillsGap}</p>
                                <p className="mt-2"><strong className="font-medium">To Learn:</strong> {skillsGap[rec.path]?.suggestedSkillsToLearn}</p>
                            </div>
                            {learningResources[rec.path] && (
                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><BookMarked className="size-5 text-blue-400"/>Recommended Resources</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        {learningResources[rec.path]?.resources.map((res, i) => (
                                            <li key={i}>{res}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
              </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
