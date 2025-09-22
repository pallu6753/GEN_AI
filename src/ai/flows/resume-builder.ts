'use server';

/**
 * @fileOverview A resume builder AI agent.
 *
 * - generateResume - A function that generates a resume based on a student's profile.
 * - ResumeBuilderInput - The input type for the generateResume function.
 * - ResumeBuilderOutput - The return type for the generateResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeBuilderInputSchema = z.object({
  name: z.string().describe("The student's full name."),
  skills: z
    .string()
    .describe("A comma-separated list of the student's skills."),
  interests: z
    .string()
    .describe("A comma-separated list of the student's interests."),
  careerPreferences: z
    .string()
    .optional()
    .describe('A brief description of the student\'s career preferences.'),
});
export type ResumeBuilderInput = z.infer<typeof ResumeBuilderInputSchema>;

const ResumeBuilderOutputSchema = z.object({
  resume: z
    .string()
    .describe('The generated resume content in Markdown format.'),
});
export type ResumeBuilderOutput = z.infer<typeof ResumeBuilderOutputSchema>;

export async function generateResume(input: ResumeBuilderInput): Promise<ResumeBuilderOutput> {
  return resumeBuilderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeBuilderPrompt',
  input: {schema: ResumeBuilderInputSchema},
  output: {schema: ResumeBuilderOutputSchema},
  prompt: `You are a professional resume writer for the Indian job market. Create a professional, concise, one-page resume in Markdown format for a student with the following details.

**Important:** The resume MUST be well-structured and aesthetically pleasing. Use clear headings, bullet points for lists, and bold text for emphasis. Fabricate plausible project and education details based on the provided skills and interests to make the resume more complete and impressive.

### Resume Details
**Name:** {{{name}}}
**Skills:** {{{skills}}}
**Interests:** {{{interests}}}
{{#if careerPreferences}}
**Career Preferences:** {{{careerPreferences}}}
{{/if}}

### Required Resume Structure (Use this exact format)

# {{{name}}}
> Email: student@example.com | Phone: +91 98765 43210 | LinkedIn: linkedin.com/in/student

## Summary
A brief, powerful summary tailored to the student's profile and career preferences.

## Education
*   **[Degree]** | [University Name] | [Year of Completion]
    *   Relevant Coursework: [List of relevant courses]

## Skills
*   **Technical Skills:** [List of technical skills]
*   **Soft Skills:** [List of soft skills]

## Projects
*   **[Project Title]** | [Technologies Used]
    *   [Brief description of the project and your role. Use 2-3 bullet points.]
*   **[Project Title 2]** | [Technologies Used]
    *   [Brief description of the project and your role. Use 2-3 bullet points.]

## Interests
*   [List of interests, formatted nicely]

---
Generate the resume now based on the above structure.
`,
});

const resumeBuilderFlow = ai.defineFlow(
  {
    name: 'resumeBuilderFlow',
    inputSchema: ResumeBuilderInputSchema,
    outputSchema: ResumeBuilderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
