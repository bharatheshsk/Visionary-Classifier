import type { ClassifyImageOutput } from '@/ai/flows/classify-image';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Label } from "@/components/ui/label"; // Import the Label component

interface ClassificationResultProps {
  imageDataUri: string | null;
  result: ClassifyImageOutput | null;
  isLoading: boolean;
  error: string | null;
}

export function ClassificationResult({ imageDataUri, result, isLoading, error }: ClassificationResultProps) {
  const confidencePercentage = result?.confidenceScore ? Math.round(result.confidenceScore * 100) : 0;

  return (
    <Card className="w-full overflow-hidden shadow-md">
      <CardHeader className="bg-secondary p-4 border-b">
        <CardTitle className="text-lg">Classification Result</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isLoading && (
          <div className="space-y-4">
             <Skeleton className="w-full h-64 rounded-md" />
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-4 w-1/2" />
             <Skeleton className="h-4 w-1/4" />
          </div>
        )}
        {!isLoading && error && (
            <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>Error classifying image: {error}</p>
            </div>
        )}
        {!isLoading && !error && imageDataUri && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2 flex-shrink-0">
              <Image
                src={imageDataUri}
                alt="Uploaded image"
                width={400}
                height={400}
                className="rounded-md object-contain aspect-square border border-border"
                data-ai-hint="uploaded image"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {result ? (
                <>
                   <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        <h3 className="text-xl font-semibold">{result.description}</h3>
                   </div>

                  <div>
                    <Label htmlFor="confidence" className="text-sm font-medium text-muted-foreground">Confidence Score</Label>
                    <div className="flex items-center gap-2 mt-1">
                        <Progress id="confidence" value={confidencePercentage} className="w-full h-3 bg-gray-200" indicatorClassName="bg-accent" />
                        <span className="text-sm font-semibold text-accent">{confidencePercentage}%</span>
                    </div>
                  </div>
                   {/* Optionally add more details from the AI response if available */}
                   {/* <p className="text-sm text-muted-foreground">Additional details...</p> */}
                </>
              ) : (
                 <p className="text-muted-foreground">No classification result available. Upload an image to start.</p>
              )}
            </div>
          </div>
        )}
        {!isLoading && !imageDataUri && !error && (
             <p className="text-muted-foreground text-center py-10">Upload an image to see the classification results here.</p>
        )}
      </CardContent>
    </Card>
  );
}

// Add a custom indicator class name prop to Progress component if not already present
// Modify components/ui/progress.tsx:
// ...
// interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
//   indicatorClassName?: string;
// }

// const Progress = React.forwardRef<
//   React.ElementRef<typeof ProgressPrimitive.Root>,
//  ProgressProps
// >(({ className, value, indicatorClassName, ...props }, ref) => (
// ...
//       <ProgressPrimitive.Indicator
//         className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
// ...
// ))
// ...
