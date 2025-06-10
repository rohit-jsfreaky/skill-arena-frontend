import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { AlertCircle } from "lucide-react";

interface ScreenshotUploaderProps {
  file: File | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => Promise<void>;
  uploading: boolean;
}

export const ScreenshotUploader = ({
  file,
  handleFileChange,
  handleUpload,
  uploading,
}: ScreenshotUploaderProps) => {
  return (
    <div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Please upload a screenshot of your game results to
              verify your performance in this tournament.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Game Screenshot
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={handleFileChange}
            className="hidden"
            id="screenshot-upload"
          />
          <label
            htmlFor="screenshot-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              {file ? file.name : "Click to select an image"}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              PNG, JPG, GIF up to 5MB
            </span>
          </label>
        </div>
      </div>

      {file && (
        <Button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <LoadingSpinner color="white" size={20} /> Uploading...
            </>
          ) : (
            "Upload Screenshot"
          )}
        </Button>
      )}
    </div>
  );
};