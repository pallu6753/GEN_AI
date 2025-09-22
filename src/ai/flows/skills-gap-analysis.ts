'use server';

/**
 * @fileOverview A skills gap analysis AI agent.
 *
 * - analyzeSkillsGap - A function that handles the skills gap analysis process.
 * - SkillsGapAnalysisInput - The input type for the analyzeSkillsGap function.
 * - SkillsGapAnalysisOutput - The return type for the analyzeSkillsGap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillsGapAnalysisInputSchema = z.object({
  studentSkills: z
    .string()
    .describe('A list of skills that the student possesses.'),
  careerPath: z.string().describe('The desired career path for the student.'),
});
export type SkillsGapAnalysisInput = z.infer<typeof SkillsGapAnalysisInputSchema>;

const SkillsGapAnalysisOutputSchema = z.object({
  skillsGap: z
    .string()
    .describe(
      'A description of the skills gap between the student skills and the skills required for the desired career path.'
    ),
  suggestedSkillsToLearn: z
    .string()
    .describe('A list of skills that the student should learn to bridge the skills gap.'),
});
export type SkillsGapAnalysisOutput = z.infer<typeof SkillsGapAnalysisOutputSchema>;

export async function analyzeSkillsGap(input: SkillsGapAnalysisInput): Promise<SkillsGapAnalysisOutput> {
  return analyzeSkillsGapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillsGapAnalysisPrompt',
  input: {schema: SkillsGapAnalysisInputSchema},
  output: {schema: SkillsGapAnalysisOutputSchema},
  prompt: `You are an expert career counselor specializing in skills gap analysis.

You will use this information to identify the skills gap between the student's current skills and the skills required for the desired career path.

Student Skills: {{{studentSkills}}}
Career Path: {{{careerPath}}}

Skills Gap:
Suggested Skills to Learn: `,
});

const analyzeSkillsGapFlow = ai.defineFlow(
  {
    name: 'analyzeSkillsGapFlow',
    inputSchema: SkillsGapAnalysisInputSchema,
    outputSchema: SkillsGapAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
