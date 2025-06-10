import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

type TournamentImageProps = {
  image_url: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload: (file: File) => Promise<void>;
  uploading: boolean;
};

const TournamentImage: React.FC<TournamentImageProps> = ({
  image_url,
  handleChange,
  handleImageUpload,
  uploading,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await handleImageUpload(selectedFile);
      // Clear the selected file after upload
      setSelectedFile(null);
      setPreviewUrl(null);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancelClick = () => {
    setSelectedFile(null);
    setPreviewUrl(null);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-white mb-1">
        Tournament Image*
      </label>

      <div className="flex flex-col space-y-4">
        {/* URL Input with Upload button (only shown when no file is selected) */}
        {!selectedFile && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <input
              type="url"
              name="image_url"
              value={image_url}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-white border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="bg-[linear-gradient(90deg,#BBF429_70%,transparent_100%)] text-black hover:bg-black px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md flex items-center justify-center"
            >
              <Upload size={16} className="mr-1" />
              Browse
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Instructions (only shown when no file is selected) */}
        {!selectedFile && (
          <p className="text-sm text-gray-300">
            Enter a URL directly or click "Browse" to choose an image from your
            device
          </p>
        )}

        {/* File selection preview with Upload/Cancel buttons */}
        {selectedFile && previewUrl && (
          <div className="border border-gray-300 p-4 rounded-md bg-black bg-opacity-40">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0">
              <div className="w-32 sm:w-24 h-32 sm:h-24 overflow-hidden rounded-md">
                <img
                  src={previewUrl}
                  alt="Selected image preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left w-full overflow-hidden">
                <p className="text-white font-medium truncate max-w-full">
                  {selectedFile.name}
                </p>
                <p className="text-gray-300 text-sm">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className={`px-3 py-1.5 rounded text-black flex items-center justify-center ${
                    uploading
                      ? "bg-[#BBF429]/30 cursor-not-allowed"
                      : "bg-[linear-gradient(90deg,#BBF429_70%,transparent_100%)] hover:bg-black"
                  }`}
                >
                  <Upload size={14} className="mr-1" />
                  {uploading ? "Uploading..." : "Upload"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelClick}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded text-white bg-gray-600 hover:bg-gray-700 flex items-center justify-center"
                >
                  <X size={14} className="mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current image preview (only if there's an image URL and no file selected) */}
        {image_url && !selectedFile && (
          <div className="w-full">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-blue-400 hover:text-blue-500 text-sm"
            >
              {showPreview ? "Hide current image" : "Show current image"}
            </button>

            {showPreview && (
              <div className="mt-2 border border-gray-300 rounded-md p-2 w-full sm:max-w-xs">
                <img
                  src={image_url}
                  alt="Tournament preview"
                  className="h-40 w-full object-contain mx-auto"
                  onError={() => {
                    console.log("Error loading image preview");
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Loading indicator */}
        {uploading && (
          <div className="text-sm text-yellow-300 animate-pulse">
            Uploading image... Please wait.
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentImage;
