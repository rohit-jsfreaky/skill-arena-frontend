import { UserContextType } from "@/context/UserContext";
import apiClient from "@/utils/apiClient";
import axios from "axios";

interface ApiResponse {
  success: boolean;
  message: string;
}

interface CreateUserProps {
  data: {
    name: string | null;
    email: string | undefined;
    profile: string;
  };
  setUser: React.Dispatch<React.SetStateAction<UserContextType | null>>;
  setReferAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const createUser = async ({
  data,
  setUser,
  setReferAlertOpen,
}: CreateUserProps): Promise<ApiResponse> => {
  console.log(data.profile);

  try {
    const response = await apiClient.post(
      `api/user/create`,
      { name: data.name, email: data.email, profile: data.profile },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("User created:", response.data.user);

    if (response.data.user !== undefined) {
      console.log("setting refer alert open");
      setReferAlertOpen(true);
    }

    setUser(response.data.user);

    return { success: true, message: response.data.message };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.error || "Something went wrong";
      console.error("❌ Error:", errorMessage);
      return { success: false, message: errorMessage };
    } else {
      console.log("Unexpected Error:", error);
      return { success: false, message: "An unexpected error occurred" };
    }
  }
};

interface updateUser {
  data: FormData;
}

export const updateUser = async ({ data }: updateUser) => {
  console.log("updating the data ", data);
  try {
    const response = await apiClient.post(`api/user/update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("User updated:", response.data);
    return { success: "User Updated" };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { error: error.response.data.message };
    }
  }
};

export const applyReferral = async (
  email: string,
  referralCode: string
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<{ message: string }>(
      `api/user/apply-referral`,
      {
        email,
        referral_code: referralCode,
      }
    );

    console.log("✅ Success:", response.data.message);
    return { success: true, message: response.data.message };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.error || "Something went wrong";
      console.error("❌ Error:", errorMessage);
      return { success: false, message: errorMessage };
    }
    console.error("❌ Unexpected Error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};
