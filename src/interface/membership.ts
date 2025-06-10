import { UserContextType } from "@/context/UserContext";

export interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  duration: {
    months: string;
  };
  benefits: string[];
}

export interface UserMembership {
  active: boolean;
  expiresAt: string;
}

export interface MembershipContextType {
  plans: MembershipPlan[];
  userMembership: UserMembership | null;
  loading: boolean;
  purchaseMembership: (membershipId: number) => void;
  purchaseLoading: boolean;
}

export interface fetchMembershipsProps {
  setPlans: React.Dispatch<React.SetStateAction<MembershipPlan[]>>;
}

export interface checkMembershipStatusProps {
  myUser: UserContextType | null;
  setUserMembership: React.Dispatch<
    React.SetStateAction<UserMembership | null>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  
}

export interface confirmMembershipProps {
  membershipId: string;
  myUser: UserContextType;
}
