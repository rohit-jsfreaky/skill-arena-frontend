import api from "@/utils/api";
import React from "react";

export interface Membership {
  id?: number;
  name: string;
  price: number;
  duration: string | null;
  benefits: string[];
  games?: Game[];
  created_at?: string;
  updated_at?: string;
}

export interface Game {
  id: number;
  name: string;
  description?: string;
  image?: string;
  status: string;
  platform?: string;
  genre?: string;
}

export interface MembershipResponse {
  success: boolean;
  message: string;
  data?: Membership | Membership[];
}

/**
 * Get all memberships
 * @param setLoading - Function to set loading state
 * @returns Promise with memberships data
 */
export const getAllMemberships = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<{ success: boolean; message: string; data?: Membership[] }> => {
  try {
    setLoading(true);
    const res = await api.get("api/admin/memberships/get-all-memberships?admin=true");

    if (res.status === 200) {
      return {
        success: true,
        message: res.data.message || "Memberships fetched successfully",
        data: res.data.data,
      };
    }
    return { success: false, message: "Failed to fetch memberships" };
  } catch (error) {
    const axiosError = error as import("axios").AxiosError;
    return {
      success: false,
      message:
        (axiosError.response?.data as { message?: string })?.message ||
        "An error occurred",
    };
  } finally {
    setLoading(false);
  }
};

/**
 * Create a new membership
 * @param membershipData - Membership data to create
 * @param setLoading - Function to set loading state
 * @returns Promise with created membership data
 */
export const createMembership = async (
  membershipData: Membership,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<MembershipResponse> => {
  try {
    setLoading(true);
    const res = await api.post(
      "api/admin/memberships/create-membership?admin=true",
      membershipData
    );

    if (res.status === 201) {
      return {
        success: true,
        message: res.data.message || "Membership created successfully",
        data: res.data.data,
      };
    }
    return { success: false, message: "Failed to create membership" };
  } catch (error) {
    const axiosError = error as import("axios").AxiosError;
    return {
      success: false,
      message:
        (axiosError.response?.data as { message?: string })?.message ||
        "An error occurred",
    };
  } finally {
    setLoading(false);
  }
};

/**
 * Update an existing membership
 * @param id - Membership ID to update
 * @param membershipData - Updated membership data
 * @param setLoading - Function to set loading state
 * @returns Promise with update result
 */
export const updateMembership = async (
  id: number,
  membershipData: Membership,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<MembershipResponse> => {
  try {
    setLoading(true);
    const res = await api.put(
      `api/admin/memberships/update-membership/${id}?admin=true`,
      membershipData
    );

    if (res.status === 200) {
      return {
        success: true,
        message: res.data.message || "Membership updated successfully",
        data: res.data.data,
      };
    }
    return { success: false, message: "Failed to update membership" };
  } catch (error) {
    const axiosError = error as import("axios").AxiosError;
    return {
      success: false,
      message:
        (axiosError.response?.data as { message?: string })?.message ||
        "An error occurred",
    };
  } finally {
    setLoading(false);
  }
};

/**
 * Delete a membership
 * @param id - Membership ID to delete
 * @param setLoading - Function to set loading state
 * @returns Promise with delete result
 */
export const deleteMembership = async (
  id: number,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<{ success: boolean; message: string }> => {
  try {
    setLoading(true);
    const res = await api.delete(`api/admin/memberships/delete-membership/${id}?admin=true`);

    if (res.status === 200) {
      return {
        success: true,
        message: res.data.message || "Membership deleted successfully",
      };
    }
    return { success: false, message: "Failed to delete membership" };
  } catch (error) {
    const axiosError = error as import("axios").AxiosError;
    return {
      success: false,
      message:
        (axiosError.response?.data as { message?: string })?.message ||
        "An error occurred",
    };
  } finally {
    setLoading(false);
  }
};