import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import axios from "axios";
import { useMYUser } from "./UserContext";
import { useUser } from "@clerk/clerk-react";
import { useAuthToken } from "./AuthTokenContext";
import { checkMembershipStatus, fetchMemberships } from "@/api/membership";
import {
  MembershipContextType,
  MembershipPlan,
  UserMembership,
} from "@/interface/membership";
import apiClient from "@/utils/apiClient";

// Create Context
export const MembershipContext = createContext<
  MembershipContextType | undefined
>(undefined);

interface MembershipProviderProps {
  children: ReactNode;
}

// Membership Provider
export const MembershipProvider = ({ children }: MembershipProviderProps) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [userMembership, setUserMembership] = useState<UserMembership | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);

  const { myUser, fetchUser } = useMYUser();
  const { user } = useUser();
  const { authToken } = useAuthToken();

  useEffect(() => {
    if (myUser) {
      if (authToken) fetchMemberships({ setPlans });
      checkMembershipStatus({
        myUser,
        setUserMembership,
        setLoading,
      });
    } else {
      if (user?.primaryEmailAddress?.emailAddress) {
        fetchUser(user?.primaryEmailAddress?.emailAddress);
      }
    }
  }, [myUser]);

  const purchaseMembership = async (membershipId: number) => {
    try {
      setPurchaseLoading(true);
      const response = await apiClient.post<{ sessionUrl: string }>(
        `api/memberships/purchase`,
        { membershipId },
        
      );
      window.location.href = response.data.sessionUrl;
    } catch (error) {
      console.error(
        "Payment error:",
        (axios.isAxiosError(error) && error.response?.data) ||
          (error as Error).message
      );
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <MembershipContext.Provider
      value={{
        plans,
        userMembership,
        loading,
        purchaseMembership,
        purchaseLoading,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};

export const useMemberShip = () => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthTokenProvider");
  }
  return context;
};
