'use server';

/**
 * @fileOverview Recommends career paths based on a student's skills and interests.
 *
 * - recommendCareerPaths - A function that recommends career paths.
 * - RecommendCareerPathsInput - The input type for the recommendCareerPaths function.
 * - RecommendCareerPathsOutput - The return type for the recommendCareerPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCareerPathsInputSchema = z.object({
  skills: z
    .string()
    .describe("A comma separated list of skills that the student possesses."),
  interests: z
    .string()
    .describe("A comma separated list of interests that the student has."),
});
export type RecommendCareerPathsInput = z.infer<typeof RecommendCareerPathsInputSchema>;

const RecommendCareerPathsOutputSchema = z.object({
  careerPaths: z.array(z.object({
    path: z.string().describe("The name of the career path."),
    rating: z.number().min(1).max(5).describe("A rating of how good a fit this path is, from 1 to 5."),
    reasoning: z.string().describe("The reasoning behind this specific career path recommendation."),
  })).describe("A list of recommended career paths."),
  summary: z.string().describe("A summary of the reasoning behind the career path recommendations."),
});
export type RecommendCareerPathsOutput = z.infer<typeof RecommendCareerPathsOutputSchema>;

export async function recommendCareerPaths(input: RecommendCareerPathsInput): Promise<RecommendCareerPathsOutput> {
  return recommendCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCareerPathsPrompt',
  input: {schema: RecommendCareerPathsInputSchema},
  output: {schema: RecommendCareerPathsOutputSchema},
  prompt: `You are a career advisor specializing in the Indian job market. Given the following skills and interests, recommend up to 3 potential career paths. 

For each path, provide:
1.  The name of the career path.
2.  A rating from 1 (poor fit) to 5 (excellent fit) indicating how well it matches the user's profile.
3.  A brief reasoning for why this path is a good match.
4.  A summary of the overall recommendations.

Skills: {{{skills}}}
Interests: {{{interests}}}

Please provide the output as a JSON object.
`,
});

const recommendCareerPathsFlow = ai.defineFlow(
  {
    name: 'recommendCareerPathsFlow',
    inputSchema: RecommendCareerPathsInputSchema,
    outputSchema: RecommendCareerPathsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
