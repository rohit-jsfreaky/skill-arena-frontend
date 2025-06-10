import { Eye, Trash2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { UserContextType } from "@/context/UserContext";
import { useState } from "react";
import DeleteUserModal from "./DeleteUserModal";
import BanUserModal from "./BanUserModal";
import { deleteUserById, banUnbanUser } from "@/api/admin/users";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";

interface UserWithBanStatus extends UserContextType {
  is_banned?: boolean;
}

type UsersMobileLayoutProps = {
  users: UserWithBanStatus[];
  formatDate: (dateString: string) => string;
  navigate: (path: string) => void;
  refetchUsers: () => void;
};

const UsersMobileLayout = ({
  users,
  formatDate,
  navigate,
  refetchUsers,
}: UsersMobileLayoutProps) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [banLoading, setBanLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [userToBan, setUserToBan] = useState<{
    id: number;
    name: string;
    is_banned?: boolean;
  } | null>(null);

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setAlertOpen(true);
  };

  const handleBanClick = (userId: number, userName: string, isBanned: boolean = false) => {
    setUserToBan({ id: userId, name: userName, is_banned: isBanned });
    setBanModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    const res = await deleteUserById(userToDelete, setDeleteLoading);
    
    if (res.success) {
      showSuccessToast("User deleted successfully");
      setAlertOpen(false);
      refetchUsers();
    } else {
      showErrorToast(res.message);
    }
  };

  const handleBanUser = async (duration: string, reason: string) => {
    if (!userToBan) return;

    const action = userToBan.is_banned ? "unban" : "ban";
    
    const res = await banUnbanUser(
      userToBan.id,
      action,
      duration,
      reason,
      setBanLoading
    );
    
    if (res.success) {
      showSuccessToast(
        userToBan.is_banned 
          ? `${userToBan.name} has been unbanned` 
          : `${userToBan.name} has been banned`
      );
      setBanModalOpen(false);
      refetchUsers();
    } else {
      showErrorToast(res.message);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-[#1A1A1A] text-white rounded-lg p-4 shadow-lg border border-[#BBF429]"
          >
            <div className="flex items-center mb-3">
              {user.profile ? (
                <img
                  src={user.profile}
                  alt={user.username}
                  className="h-10 w-10 rounded-full mr-3 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/40";
                  }}
                />
              ) : (
                <div className="h-10 w-10 rounded-full mr-3 bg-gray-600 flex items-center justify-center text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-medium text-lg">{user.username}</h3>
                {user.is_banned ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Banned
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-400">Name:</div>
              <div>{user.name || "N/A"}</div>

              <div className="text-gray-400">Email:</div>
              <div className="truncate">{user.email}</div>

              <div className="text-gray-400">Joined:</div>
              <div>{formatDate(user.created_at)}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              <Button
                onClick={() => navigate(`/admin/users/${user.id}`)}
                variant="outline"
                size="sm"
                className="bg-[#BBF429]/10 border-[#BBF429]/40 text-white hover:bg-[#BBF429]/20"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              
              <Button
                onClick={() => handleBanClick(user.id, user.username, user.is_banned)}
                variant={user.is_banned ? "default" : "secondary"}
                size="sm"
                className={user.is_banned ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}
              >
                {user.is_banned ? (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Unban
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4 mr-1" />
                    Ban
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => handleDeleteClick(user.id)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <DeleteUserModal
        alertOpen={alertOpen}
        setAlertOpen={setAlertOpen}
        deleteUser={handleDeleteUser}
        deleteLoading={deleteLoading}
      />

      {userToBan && (
        <BanUserModal
          open={banModalOpen}
          setOpen={setBanModalOpen}
          banUser={handleBanUser}
          loading={banLoading}
          isCurrentlyBanned={userToBan.is_banned || false}
          userName={userToBan.name}
        />
      )}
    </>
  );
};

export default UsersMobileLayout;
