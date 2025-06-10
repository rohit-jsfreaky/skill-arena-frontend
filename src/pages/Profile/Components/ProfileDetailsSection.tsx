import React from "react";
import ProfileImageSection from "./ProfileImageSection";
import NameAndUserName from "./NameAndUserName";
import StatsSection from "./StatsSection";
import AccountActions from "./AccountActions";
import PaymentDetailsSection from "./PaymentDetailsSection";
import { UserContextType } from "@/context/UserContext";

interface ProfileDetailsSectionProps {
  profileData: {
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    imageUrl: string | null;
    user: any;
    selectedImage: File | null;
    resetImage: () => void;
    handleImageSave: () => void;
    loading: boolean;
    handleCancelClick: () => void;
    handleEditNameClick: () => void;
    handleEditUsernameClick: () => void;
    handleSaveClick: () => void;
    isEditingName: boolean;
    isEditingUsername: boolean;
    name: string;
    setName: (name: string) => void;
    username: string;
    setUsername: (username: string) => void;
    actualUsername: string;
    isNameSaveLoading: boolean;
    myUser: UserContextType;
  };
  setAlertOpen: (open: boolean) => void;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
  fetchUser: (email: string) => Promise<void>;
}

const ProfileDetailsSection = ({
  profileData,
  setAlertOpen,
  setSelectedOption,
  fetchUser,
}: ProfileDetailsSectionProps) => {
  const {
    handleImageChange,
    imageUrl,
    user,
    selectedImage,
    resetImage,
    handleImageSave,
    loading,
    handleCancelClick,
    handleEditNameClick,
    handleEditUsernameClick,
    handleSaveClick,
    isEditingName,
    isEditingUsername,
    name,
    setName,
    username,
    setUsername,
    actualUsername,
    isNameSaveLoading,
    myUser,
  } = profileData;

  return (
    <>
      {user && (
        <div>
          <div className="flex flex-col gap-10 pt-2 lg:flex-row items-center px-2 md:px-0 justify-center">
            <ProfileImageSection
              handleImageChange={handleImageChange}
              imageUrl={imageUrl}
              user={user}
              selectedImage={selectedImage}
              resetImage={resetImage}
              handleImageSave={handleImageSave}
              loading={loading}
            />

            <NameAndUserName
              handleCancelClick={handleCancelClick}
              handleEditNameClick={handleEditNameClick}
              handleEditUsernameClick={handleEditUsernameClick}
              handleSaveClick={handleSaveClick}
              isEditingName={isEditingName}
              isEditingUsername={isEditingUsername}
              name={name}
              setName={setName}
              username={username}
              setUsername={setUsername}
              actualUsername={actualUsername}
              isNameSaveLoading={isNameSaveLoading}
            />
          </div>

          {myUser && (
            <>
              <StatsSection myUser={myUser} />
              <PaymentDetailsSection
                myUser={myUser}
                fetchUser={fetchUser}
                userEmail={user?.primaryEmailAddress?.emailAddress}
              />
              <AccountActions
                setAlertOpen={setAlertOpen}
                setSelectedOption={setSelectedOption}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileDetailsSection;
