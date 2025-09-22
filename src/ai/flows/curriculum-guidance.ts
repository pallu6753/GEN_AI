'use server';

/**
 * @fileOverview Provides curriculum guidance based on a student's profile and target career paths.
 *
 * - getCurriculumRecommendations - A function that suggests curriculum or educational tracks for a student.
 * - CurriculumGuidanceInput - The input type for the getCurriculumRecommendations function.
 * - CurriculumGuidanceOutput - The return type for the getCurriculumRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurriculumGuidanceInputSchema = z.object({
  studentProfile: z
    .string()
    .describe("The student's profile, including their skills, interests, and career preferences."),
  targetCareerPaths: z
    .string()
    .describe('The target career paths for which curriculum guidance is needed.'),
});
export type CurriculumGuidanceInput = z.infer<typeof CurriculumGuidanceInputSchema>;

const CurriculumGuidanceOutputSchema = z.object({
  recommendedCurriculum: z
    .string()
    .describe(
      'A list of recommended curriculum or educational tracks to achieve fluency in the target career paths.'
    ),
});
export type CurriculumGuidanceOutput = z.infer<typeof CurriculumGuidanceOutputSchema>;

export async function getCurriculumRecommendations(
  input: CurriculumGuidanceInput
): Promise<CurriculumGuidanceOutput> {
  return curriculumGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'curriculumGuidancePrompt',
  input: {schema: CurriculumGuidanceInputSchema},
  output: {schema: CurriculumGuidanceOutputSchema},
  prompt: `Based on the student's profile and their desired career paths, suggest specific curriculum or educational tracks. 

Student Profile: {{{studentProfile}}}
Target Career Paths: {{{targetCareerPaths}}}

Provide a detailed list of courses, specializations, or learning resources that can help the student achieve their goals.
`,
});

const curriculumGuidanceFlow = ai.defineFlow(
  {
    name: 'curriculumGuidanceFlow',
    inputSchema: CurriculumGuidanceInputSchema,
    outputSchema: CurriculumGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
