'use server';

/**
 * @fileOverview A learning resource suggestion AI agent.
 *
 * - suggestLearningResources - A function that suggests learning resources based on skills gap.
 * - LearningResourcesInput - The input type for the suggestLearningResources function.
 * - LearningResourcesOutput - The return type for the suggestLearningResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LearningResourcesInputSchema = z.object({
  skillsGap: z
    .string()
    .describe(
      'The gap between current skills and skills required for the target career path.'
    ),
  careerPath: z.string().describe('The target career path.'),
});
export type LearningResourcesInput = z.infer<typeof LearningResourcesInputSchema>;

const LearningResourcesOutputSchema = z.object({
  resources: z
    .array(z.string())
    .describe('A list of relevant online courses, workshops, and resources.'),
});
export type LearningResourcesOutput = z.infer<typeof LearningResourcesOutputSchema>;

export async function suggestLearningResources(
  input: LearningResourcesInput
): Promise<LearningResourcesOutput> {
  return suggestLearningResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningResourcesPrompt',
  input: {schema: LearningResourcesInputSchema},
  output: {schema: LearningResourcesOutputSchema},
  prompt: `You are a career advisor specializing in suggesting learning resources for Indian students.

You will use the skills gap and target career path to suggest relevant online courses, workshops, and resources.

Skills Gap: {{{skillsGap}}}
Career Path: {{{careerPath}}}

Suggest resources that are relevant to the Indian job market.

Output a JSON array of strings.`,
});

const suggestLearningResourcesFlow = ai.defineFlow(
  {
    name: 'suggestLearningResourcesFlow',
    inputSchema: LearningResourcesInputSchema,
    outputSchema: LearningResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
