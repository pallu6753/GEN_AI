'use server';

/**
 * @fileOverview Conducts a mock interview for a given career path.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - MockInterviewInput - The input type for the generateInterviewQuestions function.
 * - MockInterviewOutput - The return type for the generateInterviewQuestions function.
 * - evaluateAnswer - A function that evaluates a user's answer to a question.
 * - EvaluateAnswerInput - The input type for the evaluateAnswer function.
 * - EvaluateAnswerOutput - The return type for the evaluateAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MockInterviewInputSchema = z.object({
  careerPath: z
    .string()
    .describe('The career path for which to conduct a mock interview.'),
  questionCount: z
    .number()
    .min(1)
    .max(10)
    .default(3)
    .describe('The number of interview questions to generate.'),
});
export type MockInterviewInput = z.infer<typeof MockInterviewInputSchema>;

const MockInterviewOutputSchema = z.object({
  questions: z.array(z.string()).describe('A list of generated interview questions.'),
});
export type MockInterviewOutput = z.infer<typeof MockInterviewOutputSchema>;

const EvaluateAnswerInputSchema = z.object({
    question: z.string().describe("The interview question that was asked."),
    answer: z.string().describe("The user's answer to the question."),
});
export type EvaluateAnswerInput = z.infer<typeof EvaluateAnswerInputSchema>;

const EvaluateAnswerOutputSchema = z.object({
    feedback: z.string().describe("Constructive feedback on the user's answer."),
});
export type EvaluateAnswerOutput = z.infer<typeof EvaluateAnswerOutputSchema>;


export async function generateInterviewQuestions(input: MockInterviewInput): Promise<MockInterviewOutput> {
  return generateInterviewQuestionsFlow(input);
}

export async function evaluateAnswer(input: EvaluateAnswerInput): Promise<EvaluateAnswerOutput> {
    return evaluateAnswerFlow(input);
}

const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: MockInterviewInputSchema},
  output: {schema: MockInterviewOutputSchema},
  prompt: `You are an expert interviewer for the Indian job market. Generate {{{questionCount}}} relevant interview questions for the role of a {{{careerPath}}}.

Focus on a mix of technical, behavioral, and situational questions.
`,
});

const evaluateAnswerPrompt = ai.definePrompt({
    name: 'evaluateAnswerPrompt',
    input: {schema: EvaluateAnswerInputSchema},
    output: {schema: EvaluateAnswerOutputSchema},
    prompt: `You are an expert interviewer for the Indian job market. Evaluate the user's answer to the following interview question.

Question: {{{question}}}
Answer: {{{answer}}}

Provide constructive feedback. Focus on the clarity, structure, and content of the answer. Suggest improvements.
`,
});


const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: MockInterviewInputSchema,
    outputSchema: MockInterviewOutputSchema,
  },
  async input => {
    const {output} = await generateQuestionsPrompt(input);
    return output!;
  }
);

const evaluateAnswerFlow = ai.defineFlow(
    {
        name: 'evaluateAnswerFlow',
        inputSchema: EvaluateAnswerInputSchema,
        outputSchema: EvaluateAnswerOutputSchema,
    },
    async input => {
        const {output} = await evaluateAnswerPrompt(input);
        return output!;
    }
)
