import React from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import ProfileImage from "./ProfileImage";

interface ProfileImageSectionProps {
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null;
  user: any;
  selectedImage: File | null;
  resetImage: () => void;
  handleImageSave: () => void;
  loading: boolean;
}

const ProfileImageSection = ({
  handleImageChange,
  imageUrl,
  user,
  selectedImage,
  resetImage,
  handleImageSave,
  loading,
}: ProfileImageSectionProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <ProfileImage
        handleImageChange={handleImageChange}
        imageUrl={imageUrl}
        user={user}
      />

      {selectedImage && (
        <div className="flex text-white justify-center gap-5">
          <Button onClick={resetImage} variant={"ghost"}>
            Cancel
          </Button>
          <Button onClick={handleImageSave} variant={"secondary"}>
            {loading ? <LoadingSpinner color="green" size={24} /> : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileImageSection;