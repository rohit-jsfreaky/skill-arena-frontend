import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  image: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => Promise<void>;
  onCancelUpload: () => void;
  uploadPreview: string | null;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  image,
  onImageChange,
  onFileSelect,
  onFileUpload,
  onCancelUpload,
  uploadPreview,
  uploading,
  fileInputRef,
}) => {
  return (
    <div className="space-y-2 col-span-2">
      <Label htmlFor="image">Image</Label>
      <div className="space-y-4">
        <Input
          id="image"
          name="image"
          value={image}
          onChange={onImageChange}
          placeholder="Enter image URL"
          className="bg-[#2A2A2A] border-[#444] focus:border-[#BBF429]"
        />

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              ref={fileInputRef}
              className="bg-[#2A2A2A] border-[#444] focus:border-[#BBF429]"
            />
          </div>

          {uploadPreview && (
            <div className="space-y-2">
              <div className="relative w-full h-40 bg-[#2A2A2A] rounded-lg overflow-hidden">
                <img
                  src={uploadPreview}
                  alt="Upload preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancelUpload}
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={onFileUpload}
                  className="bg-[#BBF429] hover:bg-[#A8E000] text-black"
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2" />
                      Uploading...
                    </div>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};