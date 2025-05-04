// classify-image.ts
'use server';
/**
 * @fileOverview An image classification AI agent.
 *
 * - classifyImage - A function that handles the image classification process.
 * - ClassifyImageInput - The input type for the classifyImage function.
 * - ClassifyImageOutput - The return type for the classifyImage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ClassifyImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to classify, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifyImageInput = z.infer<typeof ClassifyImageInputSchema>;

const ClassifyImageOutputSchema = z.object({
  description: z.string().describe('A description of the image content.'),
  confidenceScore: z.number().describe('The confidence score of the classification (0-1).'),
});
export type ClassifyImageOutput = z.infer<typeof ClassifyImageOutputSchema>;

export async function classifyImage(input: ClassifyImageInput): Promise<ClassifyImageOutput> {
  return classifyImageFlow(input);
}

const classifyImagePrompt = ai.definePrompt({
  name: 'classifyImagePrompt',
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo to classify, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      description: z.string().describe('A description of the image content.'),
      confidenceScore: z.number().describe('The confidence score of the classification (0-1).'),
    }),
  },
  prompt: `You are an AI image classifier.  Describe the contents of the image, and provide a confidence score (0-1) for your classification.\n\nImage: {{media url=photoDataUri}}`,
});

const classifyImageFlow = ai.defineFlow<
  typeof ClassifyImageInputSchema,
  typeof ClassifyImageOutputSchema
>({
  name: 'classifyImageFlow',
  inputSchema: ClassifyImageInputSchema,
  outputSchema: ClassifyImageOutputSchema,
},
async input => {
  const {output} = await classifyImagePrompt(input);
  return output!;
});
