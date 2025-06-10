import {
  checkMembershipStatusProps,
  confirmMembershipProps,
  fetchMembershipsProps,
  MembershipPlan,
  UserMembership,
} from "@/interface/membership";
import apiClient from "@/utils/apiClient";
import axios from "axios";

export const fetchMemberships = async ({
  setPlans,

}: fetchMembershipsProps) => {
  try {
    const response = await apiClient.get<MembershipPlan[]>(`api/memberships`);
    setPlans(response.data);
  } catch (error) {
    console.log("Error fetching memberships:", error);
  }
};

export const checkMembershipStatus = async ({
  myUser,
  setUserMembership,
  setLoading,
}: checkMembershipStatusProps) => {
  try {
    const response = await apiClient.post<UserMembership>(
      `api/memberships/status`,

      { userId: myUser?.id },
    );
    setUserMembership(response.data);
  } catch (error) {
    console.error("Error checking membership status:", error);
  } finally {
    setLoading(false);
  }
};

export const confirmMembership = async ({
  membershipId,
  myUser,
}: confirmMembershipProps) => {
  try {
    await axios.post(
      `api/memberships/confirm`,
      { membershipId, myUser },
    );
  } catch (error) {
    console.error("Error confirming membership:", error);
  }
};
