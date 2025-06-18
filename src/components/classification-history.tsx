
"use client";

import Image from 'next/image';
import type { ClassifyImageOutput } from '@/ai/flows/classify-image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HistoryIcon } from 'lucide-react'; // Using a more generic history icon

interface HistoryItem {
  id: string;
  imageDataUri: string;
  result: ClassifyImageOutput;
}

interface ClassificationHistoryProps {
  history: HistoryItem[];
}

export function ClassificationHistory({ history }: ClassificationHistoryProps) {
  if (history.length === 0) {
    return null; 
  }

  return (
    <Card className="w-full shadow-lg rounded-lg mt-8">
      <CardHeader className="bg-secondary p-4 border-b rounded-t-lg">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-primary">
          <HistoryIcon className="h-6 w-6" />
          Classification History
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Previously classified images in this session.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[400px] w-full pr-4"> {/* Added pr-4 for scrollbar spacing */}
          {history.length === 0 ? (
             <p className="text-muted-foreground text-center py-10">No classifications yet. Upload an image to see history.</p>
          ) : (
            <div className="space-y-6">
              {history.map((item) => (
                <Card key={item.id} className="overflow-hidden shadow-md rounded-md border border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-full sm:w-1/4 flex-shrink-0">
                      <Image
                        src={item.imageDataUri}
                        alt={`Classified as ${item.result.description}`}
                        width={120} // Adjusted size for thumbnail
                        height={120}
                        className="rounded-md object-contain aspect-square border border-border"
                        data-ai-hint="history item"
                      />
                    </div>
                    <div className="w-full sm:w-3/4 space-y-1">
                      <p className="font-semibold text-lg">{item.result.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Confidence: <span className="font-medium text-accent">{Math.round(item.result.confidenceScore * 100)}%</span>
                      </p>
                      {/* You could add a timestamp here if needed in the future */}
                      {/* <p className="text-xs text-muted-foreground">Classified on: {new Date(item.id.split('-')[0]).toLocaleString()}</p> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
