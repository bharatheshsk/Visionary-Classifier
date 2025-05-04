'use server';
/**
 * @fileOverview Image description generator flow.
 *
 * - generateImageDescription - A function that handles the generation of image descriptions.
 * - GenerateImageDescriptionInput - The input type for the generateImageDescription function.
 * - GenerateImageDescriptionOutput - The return type for the generateImageDescription function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateImageDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateImageDescriptionInput = z.infer<typeof GenerateImageDescriptionInputSchema>;

const GenerateImageDescriptionOutputSchema = z.object({
  description: z.string().describe('A human-like summary of the image content.'),
});
export type GenerateImageDescriptionOutput = z.infer<typeof GenerateImageDescriptionOutputSchema>;

export async function generateImageDescription(input: GenerateImageDescriptionInput): Promise<GenerateImageDescriptionOutput> {
  return generateImageDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImageDescriptionPrompt',
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      description: z.string().describe('A human-like summary of the image content.'),
    }),
  },
  prompt: `You are an AI model that specializes in generating descriptive captions of images. Based on the image provided, create a detailed and engaging caption that summarizes the content, context, and key elements of the image, so a user can understand and share the image's context more easily.

Image: {{media url=photoDataUri}}`,
});

const generateImageDescriptionFlow = ai.defineFlow<
  typeof GenerateImageDescriptionInputSchema,
  typeof GenerateImageDescriptionOutputSchema
>(
  {
    name: 'generateImageDescriptionFlow',
    inputSchema: GenerateImageDescriptionInputSchema,
    outputSchema: GenerateImageDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
