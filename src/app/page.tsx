"use client";

import { useState } from 'react';
import type { ClassifyImageInput, ClassifyImageOutput } from '@/ai/flows/classify-image';
import { classifyImage } from '@/ai/flows/classify-image';
import { ImageUploader } from '@/components/image-uploader';
import { ClassificationResult } from '@/components/classification-result';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [result, setResult] = useState<ClassifyImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (dataUri: string) => {
    setImageDataUri(dataUri);
    setResult(null); // Clear previous result
    setError(null); // Clear previous error
    handleClassifyImage(dataUri); // Automatically classify after upload
  };

  const handleClassifyImage = async (dataUri: string | null) => {
    if (!dataUri) {
      toast({
        title: "No Image",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const input: ClassifyImageInput = { photoDataUri: dataUri };
      const classificationResult = await classifyImage(input);
      setResult(classificationResult);
      toast({
        title: "Classification Successful",
        description: `Image classified as: ${classificationResult.description}`,
      });
    } catch (err) {
      console.error("Classification error:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during classification.';
      setError(errorMessage);
      toast({
        title: "Classification Failed",
        description: errorMessage,
        variant: "destructive",
      });
       setResult(null); // Clear result on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12 lg:p-24 bg-background">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
         <h1 className="text-3xl md:text-4xl font-bold text-center text-primary flex items-center gap-2">
            <ImageIcon className="h-8 w-8" />
            Visionary Classifier
         </h1>
      </div>

      <div className="w-full max-w-3xl space-y-8">
        <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />

        {/* Remove the explicit classify button as classification happens on upload */}
        {/* {imageDataUri && (
            <Button onClick={() => handleClassifyImage(imageDataUri)} disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Classifying...
                </>
              ) : (
                'Classify Image'
              )}
            </Button>
        )} */}

        <ClassificationResult
          imageDataUri={imageDataUri}
          result={result}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <footer className="mt-16 text-center text-muted-foreground text-sm">
        Powered by Firebase Genkit & Google AI. Designed by an expert.
      </footer>
    </main>
  );
}
