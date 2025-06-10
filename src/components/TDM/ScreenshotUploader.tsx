import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploader } from '@/components/FileUploader';
import { Upload } from "lucide-react";

interface ScreenshotUploaderProps {
  onUpload: (screenshotUrl: string) => Promise<void>;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  fullWidth?: boolean;
}

const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({ 
  onUpload, 
  buttonText = "Upload Screenshot",
  buttonVariant = "default",
  fullWidth = false
}) => {
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!screenshotUrl) return;
    
    setIsUploading(true);
    try {
      await onUpload(screenshotUrl);
      setScreenshotUrl('');
      document.querySelector<HTMLButtonElement>('.dialog-close')?.click();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          className={fullWidth ? "w-full" : ""}
        >
          <Upload className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Match Screenshot</DialogTitle>
          <DialogDescription>
            Upload a screenshot of the match result
          </DialogDescription>
        </DialogHeader>
        <FileUploader
          onFileSelect={(url) => setScreenshotUrl(url)}
          value={screenshotUrl}
          accept="image/*"
        />
        {screenshotUrl && (
          <div className="mt-4">
            <img 
              src={screenshotUrl} 
              alt="Match Screenshot" 
              className="max-h-[300px] rounded-md object-contain mx-auto"
            />
          </div>
        )}
        <DialogFooter>
          <DialogClose className="dialog-close" asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleUpload} 
            disabled={!screenshotUrl || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Screenshot'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenshotUploader;