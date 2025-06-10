import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useAuthToken } from "./AuthTokenContext";

export interface UserContextType {
  id: number;
  name: string;
  email: string;
  profile: string | null;
  wallet: number | null;
  total_games_played: number | null;
  total_wins: number | null;
  referral_code: string;
  created_at: string;
  username: string;
  applied_referral: boolean;
  membership_expiry: string;
  membership_id: number;
  is_banned?: boolean;
  banned_until?: string | null;
  ban_reason?: string | null;
  account_details?: string | null;
  upi_id?: string | null;
  upi_qr_code_url?: string | null;
  paytm_number?: string | null;
}

interface UserContextValue {
  myUser: UserContextType | null;
  setUser: React.Dispatch<React.SetStateAction<UserContextType | null>>;
  fetchUser: (email: string) => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [myUser, setUser] = useState<UserContextType | null>(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { authToken } = useAuthToken();

  const fetchUser = async (email: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}api/user/get`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.user);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    if (isSignedIn && authToken) {
      console.log("fetching user", user);
      if (user && user.primaryEmailAddress?.emailAddress) {
        fetchUser(user.primaryEmailAddress.emailAddress);
      }
    }
  }, [isSignedIn, user, authToken]);

  return (
    <UserContext.Provider value={{ myUser, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useMYUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthTokenProvider");
  }
  return context;
};
