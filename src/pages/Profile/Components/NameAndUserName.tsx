import { LoadingSpinner } from "@/components/my-ui/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

interface NameAndUserNameProps {
  isEditingName: boolean;
  setName: (name: string) => void;
  name: string;
  handleEditNameClick: () => void;
  isEditingUsername: boolean;
  username: string;
  setUsername: (username: string) => void;
  handleEditUsernameClick: () => void;
  handleCancelClick: () => void;
  handleSaveClick: () => void;
  actualUsername: string;
  isNameSaveLoading: boolean;
}
const NameAndUserName = ({
  isEditingName,
  setName,
  name,
  handleEditNameClick,
  isEditingUsername,
  username,
  setUsername,
  handleEditUsernameClick,
  handleCancelClick,
  handleSaveClick,
  actualUsername,
  isNameSaveLoading,
}: NameAndUserNameProps) => {
  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-[#BBF429]/20">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Full Name</label>
            {isEditingName ? (
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/50 border-[#BBF429]/20 text-white focus:border-[#BBF429]"
              />
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-white text-lg font-medium">{name || "Add Name"}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditNameClick}
                  className="text-[#BBF429] hover:bg-[#BBF429]/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Username</label>
            {isEditingUsername ? (
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/50 border-[#BBF429]/20 text-white focus:border-[#BBF429]"
              />
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-white text-lg font-medium">
                  {actualUsername || "Add Username"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditUsernameClick}
                  className="text-[#BBF429] hover:bg-[#BBF429]/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {(isEditingName || isEditingUsername) && (
        <div className="flex justify-end space-x-3">
          <Button
            variant="ghost"
            onClick={handleCancelClick}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            className="bg-[#BBF429] text-black hover:bg-[#BBF429]/90"
            disabled={isNameSaveLoading}
          >
            {isNameSaveLoading ? (
              <LoadingSpinner color="black" size={24} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NameAndUserName;
