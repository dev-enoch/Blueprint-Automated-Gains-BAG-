'use server';

/**
 * @fileOverview An AI agent for generating initial topic content based on a brief description.
 *
 * - generateInitialContent - A function that generates initial topic content.
 * - GenerateInitialContentInput - The input type for the generateInitialContent function.
 * - GenerateInitialContentOutput - The return type for the generateInitialContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialContentInputSchema = z.object({
  description: z.string().describe('A brief description of the topic content to generate.'),
});
export type GenerateInitialContentInput = z.infer<typeof GenerateInitialContentInputSchema>;

const GenerateInitialContentOutputSchema = z.object({
  content: z.string().describe('The generated topic content, formatted as Markdown/HTML.'),
});
export type GenerateInitialContentOutput = z.infer<typeof GenerateInitialContentOutputSchema>;

export async function generateInitialContent(
  input: GenerateInitialContentInput
): Promise<GenerateInitialContentOutput> {
  return generateInitialContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialContentPrompt',
  input: {schema: GenerateInitialContentInputSchema},
  output: {schema: GenerateInitialContentOutputSchema},
  prompt: `You are an expert course content creator. Based on the description provided, generate initial content for a topic.  Format the content as Markdown/HTML.

Description: {{{description}}}`,
});

const generateInitialContentFlow = ai.defineFlow(
  {
    name: 'generateInitialContentFlow',
    inputSchema: GenerateInitialContentInputSchema,
    outputSchema: GenerateInitialContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      content: output!.content,
    };
  }
);
