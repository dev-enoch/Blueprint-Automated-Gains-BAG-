'use server';

/**
 * @fileOverview Summarizes the content of a topic using an LLM.
 *
 * - summarizeTopicContent - A function that summarizes topic content.
 * - SummarizeTopicContentInput - The input type for the summarizeTopicContent function.
 * - SummarizeTopicContentOutput - The return type for the summarizeTopicContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTopicContentInputSchema = z.object({
  content: z.string().describe('The content of the topic to summarize.'),
});
export type SummarizeTopicContentInput = z.infer<
  typeof SummarizeTopicContentInputSchema
>;

const SummarizeTopicContentOutputSchema = z.object({
  summary: z.string().describe('The summary of the topic content.'),
});
export type SummarizeTopicContentOutput = z.infer<
  typeof SummarizeTopicContentOutputSchema
>;

export async function summarizeTopicContent(
  input: SummarizeTopicContentInput
): Promise<SummarizeTopicContentOutput> {
  return summarizeTopicContentFlow(input);
}

const summarizeTopicContentPrompt = ai.definePrompt({
  name: 'summarizeTopicContentPrompt',
  input: {schema: SummarizeTopicContentInputSchema},
  output: {schema: SummarizeTopicContentOutputSchema},
  prompt: `Summarize the following topic content in a concise manner:\n\n{{{content}}}`,
});

const summarizeTopicContentFlow = ai.defineFlow(
  {
    name: 'summarizeTopicContentFlow',
    inputSchema: SummarizeTopicContentInputSchema,
    outputSchema: SummarizeTopicContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeTopicContentPrompt(input);
    return {
      summary: output!.summary,
    };
  }
);
