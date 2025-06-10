import { UserContextType } from "@/context/UserContext";

export interface UnreadMessagesCount {
  [senderId: number]: number;
}

export interface fetchUnreadCountsProps {
  currentUser: UserContextType;
  setUnreadCounts: React.Dispatch<React.SetStateAction<UnreadMessagesCount>>;
  authToken: string;
}

export interface fetchUsersProps {
  currentUser: UserContextType;
  setUsers: React.Dispatch<React.SetStateAction<UserContextType[]>>;
  authToken: string;
}
