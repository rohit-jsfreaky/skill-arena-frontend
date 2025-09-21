import { Eye, Trash2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { UserContextType } from "@/context/UserContext";
import { JSX, useState } from "react";
import DeleteUserModal from "./DeleteUserModal";
import BanUserModal from "./BanUserModal";
import { deleteUserById, banUnbanUser } from "@/api/admin/users";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import Table from "@/containers/Table/Table";

// Add is_banned to the UserContextType or update the component props
interface UserWithBanStatus extends UserContextType {
  is_banned?: boolean;
}

type UsersLargeViewProps = {
  users: UserWithBanStatus[];
  formatDate: (dateString: string) => string;
  navigate: (path: string) => void;
  refetchUsers: () => void;
};

const UsersLargeView = ({
  users,
  formatDate,
  navigate,
  refetchUsers,
}: UsersLargeViewProps) => {
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

  const handleDeleteClick = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserToDelete(userId);
    setAlertOpen(true);
  };

  const handleBanClick = (
    userId: number,
    userName: string,
    isBanned: boolean = false,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
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

  interface Column {
    key: string;
    label: string;
    render: (user: UserWithBanStatus) => JSX.Element;
  }

  const columns: Column[] = [
    {
      key: "user",
      label: "User",
      render: (user: UserWithBanStatus) => (
        <div className="flex items-center">
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
            <div className="h-10 w-10 rounded-full mr-3 bg-gray-600 flex items-center justify-center">
              {user.username ? user.username.charAt(0).toUpperCase() : "?"}
            </div>
          )}
          <div>
            <div className="font-medium">{user.username || "Unknown"}</div>
            <div className="text-sm text-gray-400">{user.name || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (user: UserWithBanStatus) => (
        <span className="truncate max-w-[200px]">{user.email}</span>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (user: UserWithBanStatus) => <span>{formatDate(user.created_at)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (user: UserWithBanStatus) =>
        user.is_banned ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Banned
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: UserWithBanStatus) => (
        <div className="flex space-x-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/users/${user.id}`);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white"
            title="View User"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            onClick={(e) =>
              handleBanClick(user.id, user.username, user.is_banned, e)
            }
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${
              user.is_banned
                ? "text-green-500 hover:text-green-400 hover:bg-green-900/20"
                : "text-yellow-500 hover:text-yellow-400 hover:bg-yellow-900/20"
            }`}
            title={user.is_banned ? "Unban User" : "Ban User"}
          >
            {user.is_banned ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <ShieldAlert className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={(e) => handleDeleteClick(user.id, e)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-900/20"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={users.map((user) => ({ ...user }))}
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
      />

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

export default UsersLargeView;
