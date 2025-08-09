'use server';

/**
 * @fileOverview A file summarization AI agent.
 *
 * - summarizeFile - A function that handles the file summarization process.
 * - SummarizeFileInput - The input type for the summarizeFile function.
 * - SummarizeFileOutput - The return type for the summarizeFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFileInputSchema = z.object({
  text: z.string().describe('The text to summarize.'),
});
export type SummarizeFileInput = z.infer<typeof SummarizeFileInputSchema>;

const SummarizeFileOutputSchema = z.object({
  summary: z.string().describe('The summary of the text.'),
});
export type SummarizeFileOutput = z.infer<typeof SummarizeFileOutputSchema>;

export async function summarizeFile(input: SummarizeFileInput): Promise<SummarizeFileOutput> {
  return summarizeFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFilePrompt',
  input: {schema: SummarizeFileInputSchema},
  output: {schema: SummarizeFileOutputSchema},
  prompt: `Summarize the following text:\n\n{{{text}}}`,
});

const summarizeFileFlow = ai.defineFlow(
  {
    name: 'summarizeFileFlow',
    inputSchema: SummarizeFileInputSchema,
    outputSchema: SummarizeFileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
