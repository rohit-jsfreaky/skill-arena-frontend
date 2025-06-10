import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Game, createGame, updateGame } from "@/api/admin/games";
import { GameBasicInfo } from "./GameFormComponents/GameBasicInfo";
import { ImageUpload } from "./GameFormComponents/ImageUpload";
import api from "@/utils/api";

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onSuccess: () => void;
}

const GameFormModal: React.FC<GameFormModalProps> = ({
  isOpen,
  onClose,
  game,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<Game>>({
    name: "",
    description: "",
    image: "",
    status: "upcoming",
    platform: "",
    genre: "",
    release_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        description: game.description || "",
        image: game.image || "",
        status: game.status,
        platform: game.platform || "",
        genre: game.genre || "",
        release_date: game.release_date
          ? new Date(game.release_date).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
        status: "upcoming",
        platform: "",
        genre: "",
        release_date: "",
      });
    }
  }, [game, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await api.post(
        "api/admin/tournaments/upload-image",
        formData
      );

      const data = response.data;
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        setSelectedFile(null);
        setUploadPreview(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setUploadPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name) {
        throw new Error("Game name is required");
      }

      if (!formData.status) {
        throw new Error("Game status is required");
      }

      console.log(formData.release_date);
      if (game) {
        // Update existing game
        await updateGame(game.id, formData);
      } else {
        // Create new game
        await createGame(formData as Omit<Game, "id" | "created_at">);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error submitting game:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(()=>{
    console.log("formData",formData)
  },[formData])
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] text-white border border-[#BBF429] max-w-3xl my-4 h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#BBF429]">
            {game ? "Edit Game" : "Add New Game"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GameBasicInfo
              name={formData.name || ""}
              status={formData.status || ""}
              platform={formData.platform || ""}
              genre={formData.genre || ""}
              release_date={formData.release_date || ""}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
            />

            <ImageUpload
              image={formData.image || ""}
              onImageChange={handleChange}
              onFileSelect={handleFileSelect}
              onFileUpload={handleFileUpload}
              onCancelUpload={cancelUpload}
              uploadPreview={uploadPreview}
              uploading={uploading}
              fileInputRef={fileInputRef}
            />

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Enter game description"
                className="bg-[#2A2A2A] border-[#444] focus:border-[#BBF429] min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="default"
              onClick={onClose}
              className="border-[#BBF429] text-white hover:bg-[#2A2A2A]"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#BBF429] hover:bg-[#A8E000] text-black"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2" />
                  {game ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <>{game ? "Update Game" : "Create Game"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GameFormModal;
