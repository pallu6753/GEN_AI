"use server";

import {
  analyzeSkillsGap as analyzeSkillsGapFlow,
  type SkillsGapAnalysisInput,
} from "@/ai/flows/skills-gap-analysis";
import {
  recommendCareerPaths as recommendCareerPathsFlow,
  type RecommendCareerPathsInput,
} from "@/ai/flows/career-path-recommendations";
import {
  suggestLearningResources as suggestLearningResourcesFlow,
  type LearningResourcesInput,
} from "@/ai/flows/learning-resources-suggestion";
import {
  getJobMarketInsights as getJobMarketInsightsFlow,
  type JobMarketInsightsInput,
} from "@/ai/flows/job-market-insights";
import {
  getCurriculumRecommendations as getCurriculumRecommendationsFlow,
  type CurriculumGuidanceInput,
} from "@/ai/flows/curriculum-guidance";
import {
  assessSkills as assessSkillsFlow,
  type SkillAssessmentInput,
} from "@/ai/flows/skill-assessment";
import {
  generateResume as generateResumeFlow,
  type ResumeBuilderInput,
} from "@/ai/flows/resume-builder";
import {
  generateInterviewQuestions as generateInterviewQuestionsFlow,
  evaluateAnswer as evaluateAnswerFlow,
  type MockInterviewInput,
  type EvaluateAnswerInput,
} from "@/ai/flows/mock-interview";


async function handleFlow<T, U>(flow: (input: T) => Promise<U>, input: T) {
  try {
    const data = await flow(input);
    return { success: true, data };
  } catch (error) {
    console.error("AI Flow Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}

export const recommendCareerPaths = async (input: RecommendCareerPathsInput) =>
  await handleFlow(recommendCareerPathsFlow, input);

export const analyzeSkillsGap = async (input: SkillsGapAnalysisInput) =>
  await handleFlow(analyzeSkillsGapFlow, input);

export const suggestLearningResources = async (input: LearningResourcesInput) =>
  await handleFlow(suggestLearningResourcesFlow, input);

export const getJobMarketInsights = async (input: JobMarketInsightsInput) =>
  await handleFlow(getJobMarketInsightsFlow, input);

export const getCurriculumRecommendations = async (input: CurriculumGuidanceInput) =>
  await handleFlow(getCurriculumRecommendationsFlow, input);

export const assessSkills = async (input: SkillAssessmentInput) =>
  await handleFlow(assessSkillsFlow, input);

export const generateResume = async (input: ResumeBuilderInput) =>
  await handleFlow(generateResumeFlow, input);

export const generateInterviewQuestions = async (input: MockInterviewInput) =>
  await handleFlow(generateInterviewQuestionsFlow, input);

export const evaluateAnswer = async (input: EvaluateAnswerInput) =>
  await handleFlow(evaluateAnswerFlow, input);
