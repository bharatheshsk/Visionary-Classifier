"use client";

import type * as React from 'react';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (dataUri: string) => void;
  isLoading: boolean;
}

export function ImageUploader({ onImageUpload, isLoading }: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please upload an image (JPEG, PNG, GIF, WEBP, etc.).');
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError(`File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.`);
       // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUri = loadEvent.target?.result as string;
      if (dataUri) {
        onImageUpload(dataUri);
      } else {
        setError('Failed to read the image file.');
      }
    };
    reader.onerror = () => {
      setError('Error reading the image file.');
       // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Upload Image</Label>
        <div className="flex items-center gap-2">
            <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            ref={fileInputRef}
            className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
             <Button type="button" size="icon" variant="ghost" disabled={isLoading} onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-5 w-5" />
             </Button>
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
