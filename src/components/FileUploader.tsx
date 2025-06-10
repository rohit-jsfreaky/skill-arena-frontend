import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import { Upload, FileText, Image, X } from "lucide-react";
import { cn } from "@/lib/utils";
import apiClient from "@/utils/apiClient";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import { handleImageUpload } from "@/api/tournamentsResult";

interface FileUploaderProps {
  value: string;
  onFileSelect: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onFileSelect,
  accept = "image/*",
  maxSize = 5, // Default 5MB
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      showErrorToast(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    const { data, message, success } = await handleImageUpload(
      file,
      setIsUploading
    );

    if (!success) return showErrorToast(message);
    onFileSelect(data);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Check if file type matches accept attribute
    const fileType = file.type;
    const acceptTypes = accept.split(",").map((type) => type.trim());
    const isAccepted = acceptTypes.some((type) => {
      if (type === "*/*") return true;
      if (type.endsWith("/*") && fileType.startsWith(type.replace("/*", "/")))
        return true;
      return type === fileType;
    });

    if (!isAccepted) {
      showErrorToast(`File type not accepted. Please upload ${accept}`);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      showErrorToast(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    const { data, message, success } = await handleImageUpload(
      file,
      setIsUploading
    );

    if (!success) return showErrorToast(message);
    onFileSelect(data);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        "/api/tournament-results/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const fileUrl = response.data.url;
        onFileSelect(fileUrl);
        showSuccessToast("File uploaded successfully");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      showErrorToast(
        error?.response?.data?.message ||
          "Failed to upload file. Please try again."
      );
    } finally {
      setIsUploading(false);
      // Clear the input value to allow re-uploading the same file
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clearFile = () => {
    onFileSelect("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isImage = accept.includes("image");

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          isDragging ? "border-primary/80 bg-primary/5" : "border-border",
          isUploading && "opacity-70 cursor-not-allowed",
          "flex flex-col items-center justify-center gap-3 cursor-pointer"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()} // Added click handler
      >
        {isUploading ? (
          <>
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            {isImage ? (
              <Image className="h-10 w-10 text-muted-foreground" />
            ) : (
              <FileText className="h-10 w-10 text-muted-foreground" />
            )}
            <div className="text-center">
              <p className="text-sm font-medium">
                Drag & drop {isImage ? "image" : "file"} here, or click to
                select
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accept.replace("*", "")} ({maxSize}MB max)
              </p>
            </div>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); 
                inputRef.current?.click();
              }}
              className="mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
        className="sr-only"
        data-testid="file-input"
      />

      {value && (
        <div className="relative border rounded-md p-3 mt-4 bg-secondary/20">
          <div className="flex items-center gap-3">
            {isImage ? (
              <div className="w-12 h-12 rounded-md overflow-hidden bg-background flex items-center justify-center">
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-md bg-background flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {value.split("/").pop()}
              </p>
              <p className="text-xs text-muted-foreground">
                File uploaded successfully
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
