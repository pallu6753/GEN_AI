'use server';

/**
 * @fileOverview A skill assessment AI agent.
 *
 * - assessSkills - A function that assesses a student's skills based on a questionnaire and optional transcript.
 * - SkillAssessmentInput - The input type for the assessSkills function.
 * - SkillAssessmentOutput - The return type for the assessSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillAssessmentInputSchema = z.object({
  questionnaireAnswers: z.string().describe("The student's answers to the skill assessment questionnaire."),
  transcriptDataUri: z
    .string()
    .optional()
    .describe(
      "The student's transcript, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SkillAssessmentInput = z.infer<typeof SkillAssessmentInputSchema>;

const SkillAssessmentOutputSchema = z.object({
  strengths: z.array(z.string()).describe("A list of the student's identified strengths."),
  weaknesses: z.array(z.string()).describe("A list of the student's identified weaknesses."),
  summary: z.string().describe("A brief summary of the skill assessment."),
  skillScores: z.array(z.object({
    skill: z.string().describe("The name of the skill."),
    score: z.number().min(1).max(10).describe("The proficiency score for the skill, from 1 to 10."),
  })).describe("An array of key skills and their proficiency scores (1-10).")
});
export type SkillAssessmentOutput = z.infer<typeof SkillAssessmentOutputSchema>;

export async function assessSkills(input: SkillAssessmentInput): Promise<SkillAssessmentOutput> {
  return skillAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillAssessmentPrompt',
  input: {schema: SkillAssessmentInputSchema},
  output: {schema: SkillAssessmentOutputSchema},
  prompt: `You are an expert career counselor. Analyze the provided skill assessment information to identify the student's strengths and weaknesses.

Questionnaire Answers:
{{{questionnaireAnswers}}}

{{#if transcriptDataUri}}
Transcript:
{{media url=transcriptDataUri}}
{{/if}}

Based on this information, provide:
1. A summary of the assessment.
2. A list of key strengths.
3. A list of areas for improvement (weaknesses).
4. An array of 5-7 key skills, each with a proficiency score from 1 (beginner) to 10 (expert). This should be in the 'skillScores' field.
`,
});

const skillAssessmentFlow = ai.defineFlow(
  {
    name: 'skillAssessmentFlow',
    inputSchema: SkillAssessmentInputSchema,
    outputSchema: SkillAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
