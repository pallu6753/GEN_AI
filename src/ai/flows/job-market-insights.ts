'use server';

/**
 * @fileOverview Provides real-time insights into emerging job roles and required skills specifically for the Indian job market.
 *
 * - getJobMarketInsights - A function that retrieves job market insights.
 * - JobMarketInsightsInput - The input type for the getJobMarketInsights function.
 * - JobMarketInsightsOutput - The return type for the getJobMarketInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobMarketInsightsInputSchema = z.object({
  query: z
    .string()
    .describe(
      'A query describing the type of job market insights requested, e.g., "emerging tech jobs in Bangalore" or "skills needed for data science roles".'
    ),
});
export type JobMarketInsightsInput = z.infer<typeof JobMarketInsightsInputSchema>;

const JobMarketInsightsOutputSchema = z.object({
  insights: z.string().describe('Real-time insights into emerging job roles and required skills in the Indian job market.'),
});
export type JobMarketInsightsOutput = z.infer<typeof JobMarketInsightsOutputSchema>;

export async function getJobMarketInsights(input: JobMarketInsightsInput): Promise<JobMarketInsightsOutput> {
  return jobMarketInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMarketInsightsPrompt',
  input: {schema: JobMarketInsightsInputSchema},
  output: {schema: JobMarketInsightsOutputSchema},
  prompt: `You are an AI career advisor specializing in the Indian job market. Provide real-time insights into emerging job roles and required skills based on the student's query.

Query: {{{query}}}

Insights:`,
});

const jobMarketInsightsFlow = ai.defineFlow(
  {
    name: 'jobMarketInsightsFlow',
    inputSchema: JobMarketInsightsInputSchema,
    outputSchema: JobMarketInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
