import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  name: string;
  profile: string | null;
  created_at: string;
}

interface RecentUsersListProps {
  users: User[];
  title: string;
}

const RecentUsersList = ({ users, title }: RecentUsersListProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) {
      return format(parseISO(dateString), 'MM/dd/yy');
    }
    return format(parseISO(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="bg-black/70 border border-[#BBF429]/30 rounded-lg p-3 sm:p-4 md:p-5 shadow-lg">
      <h3 className="text-base sm:text-lg font-medium text-white mb-2 sm:mb-4">{title}</h3>
      <div className="space-y-2 sm:space-y-4">
        {users.map((user) => (
          <div 
            key={user.id}
            className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-[#BBF429]/10 cursor-pointer transition-colors"
            onClick={() => navigate(`/admin/users/${user.id}`)}
          >
            {user.profile ? (
              <img
                src={user.profile}
                alt={user.username}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                }}
              />
            ) : (
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm sm:text-base">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="ml-2 sm:ml-4 flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base truncate">
                {user?.username}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm truncate">
                {user.name || "N/A"}
              </p>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 ml-2 whitespace-nowrap">
              {formatDate(user.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsersList;