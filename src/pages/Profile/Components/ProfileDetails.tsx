import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import ProfileImage from "./ProfileImage";
import NameAndUserName from "./NameAndUserName";
import EmailArea from "./EmailArea";
import StatsArea from "./StatsArea";
import { Trophy, Star, Wallet, Globe, Medal, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { User } from "@clerk/clerk-react";

interface ProfileDetailsProps {
  user: User;
  myUser: any;
  imageUrl: string | null;
  selectedImage: File | null;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageSave: () => Promise<void>;
  loading: boolean;
  setImageUrl: (url: string | null) => void;
  setSelectedImage: (image: File | null) => void;
  isEditingName: boolean;
  isEditingUsername: boolean;
  name: string;
  username: string;
  actualUsername: string;
  isNameSaveLoading: boolean;
  handleEditNameClick: () => void;
  handleEditUsernameClick: () => void;
  handleCancelClick: () => void;
  handleSaveClick: () => Promise<void>;
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  setAlertOpen: (open: boolean) => void;
}

const ProfileDetails = ({
  user,
  myUser,
  imageUrl,
  selectedImage,
  handleImageChange,
  handleImageSave,
  loading,
  setImageUrl,
  setSelectedImage,
  isEditingName,
  isEditingUsername,
  name,
  username,
  actualUsername,
  isNameSaveLoading,
  handleEditNameClick,
  handleEditUsernameClick,
  handleCancelClick,
  handleSaveClick,
  setName,
  setUsername,
  setAlertOpen
}: ProfileDetailsProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col gap-10 pt-2 lg:flex-row items-center px-2 md:px-0 justify-center">
        <ProfileImage
          handleImageChange={handleImageChange}
          imageUrl={imageUrl}
          user={user}
        />

        {selectedImage && (
          <>
            <div className="flex text-white justify-center gap-5">
              <Button
                onClick={() => {
                  setImageUrl(myUser?.profile ?? user?.imageUrl ?? null);
                  setSelectedImage(null);
                }}
                variant={"ghost"}
              >
                Cancel
              </Button>
              <Button onClick={handleImageSave} variant={"secondary"}>
                {loading ? <LoadingSpinner color="green" size={24} /> : "Save"}
              </Button>
            </div>
          </>
        )}

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

      <div className="px-4 md:px-8 py-6">
        <EmailArea myUser={myUser} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsArea
            title="Win Rate"
            value="10.0%"
            icon={<Trophy className="h-5 w-5" />}
          />
          <StatsArea
            title="Reviews"
            value="0"
            icon={<Star className="h-5 w-5" />}
          />
          <StatsArea
            title="Balance"
            value={`₹${myUser.wallet || "0"}`}
            icon={<Wallet className="h-5 w-5" />}
          />
          <StatsArea
            title="Region"
            value="Asia"
            icon={<Globe className="h-5 w-5" />}
          />
          <StatsArea
            title="Games Played"
            value={String(myUser.total_games_played || "0")}
            icon={<Medal className="h-5 w-5" />}
          />
          <StatsArea
            title="Member Since"
            value={new Date(myUser.created_at).toLocaleDateString()}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        <div className="mt-8 bg-black/30 backdrop-blur-sm border border-[#BBF429]/20 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-[#BBF429] font-semibold text-lg">
                Account Actions
              </h3>
              <p className="text-gray-400 text-sm">
                Manage your account statistics and history
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-[#BBF429]/20 hover:bg-[#BBF429]/30 text-[#BBF429] border border-[#BBF429]/40"
                onClick={() => {
                  /* handle reset */
                }}
              >
                Reset Statistics
              </Button>
              <Button
                className="bg-[#BBF429]/20 hover:bg-[#BBF429]/30 text-[#BBF429] border border-[#BBF429]/40"
                onClick={() => navigate("/history")}
              >
                View History
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="destructive"
            className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/40"
            onClick={() => setAlertOpen(true)}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;