import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMYUser } from "@/context/UserContext";
import { useAuthToken } from "@/context/AuthTokenContext";
import { updateUser } from "@/api/user";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";

export const useUserProfile = () => {
  const { user } = useUser();
  const { myUser, fetchUser } = useMYUser();
  const { authToken } = useAuthToken();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [name, setName] = useState(myUser?.name || "");
  const [username, setUsername] = useState(myUser?.username || "");
  const [actualUsername, setActualUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const [isNameSaveLoading, setIsNameSaveLoading] = useState(false);

  useEffect(() => {
    if (myUser?.profile) {
      setImageUrl(myUser.profile);
    } else if (user?.imageUrl) {
      setImageUrl(user.imageUrl);
    } else {
      setImageUrl(null);
    }

    if (myUser?.name) {
      setName(myUser.name);
    } else if (user?.fullName) {
      setName(user?.fullName);
    } else {
      setName("");
    }

    if (myUser?.username) {
      setUsername(myUser?.username || "");
      setActualUsername(myUser.username);
    } else if (user?.username) {
      setUsername(user?.username);
      setActualUsername(user?.username);
    } else {
      setUsername(myUser?.username || "");
      setActualUsername("");
    }
  }, [myUser, user]);

  useEffect(() => {
    setName(user?.fullName || "");
  }, [user]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleEditNameClick = () => setIsEditingName(true);
  const handleEditUsernameClick = () => setIsEditingUsername(true);

  const handleCancelClick = () => {
    setIsEditingName(false);
    setIsEditingUsername(false);
    setName(user?.fullName || "");
  };

  const handleSaveClick = async () => {
    setIsNameSaveLoading(true);
    const formData = new FormData();

    setLoading(true);
    if (myUser) {
      (Object.keys(myUser) as (keyof typeof myUser)[]).forEach((key) => {
        if (key !== "name" && key !== "username") {
          formData.append(key, myUser[key] as string | Blob);
        }
      });
    }

    if (name) {
      formData.append("name", name);
    }

    if (username) {
      formData.append("username", username);
    }

    if (authToken) {
      const response = await updateUser({
        data: formData,
      });

      if (response) {
        if (response.success) {
          showSuccessToast(response.success);
          if (user?.primaryEmailAddress?.emailAddress) {
            fetchUser(user?.primaryEmailAddress?.emailAddress);
          }

          setSelectedImage(null);
          setActualUsername(username);
        } else if (response.error) {
          showErrorToast(response.error);
        }
      }
    }

    setIsNameSaveLoading(false);
    setIsEditingName(false);
    setIsEditingUsername(false);
  };

  const handleImageSave = async () => {
    const formData = new FormData();

    setLoading(true);
    if (myUser) {
      (Object.keys(myUser) as (keyof typeof myUser)[]).forEach((key) => {
        if (key !== "profile") {
          formData.append(key, myUser[key] as string | Blob);
        }
      });
    }

    if (selectedImage) {
      formData.append("profile", selectedImage);
    }

    if (authToken) {
      const response = await updateUser({
        data: formData,
      });

      if (response) {
        if (response.success) {
          showErrorToast(response.success);
          if (user?.primaryEmailAddress?.emailAddress) {
            fetchUser(user?.primaryEmailAddress?.emailAddress);
          }

          setSelectedImage(null);
        } else if (response.error) {
          showErrorToast(response.error);
        }
      }
    }

    setLoading(false);
  };

  const resetImage = () => {
    setImageUrl(myUser?.profile ?? user?.imageUrl ?? null);
    setSelectedImage(null);
  };

  return {
    user,
    myUser,
    selectedImage,
    imageUrl,
    isEditingName,
    isEditingUsername,
    name,
    username,
    actualUsername,
    loading,
    isNameSaveLoading,
    handleImageChange,
    handleEditNameClick,
    handleEditUsernameClick,
    handleCancelClick,
    handleSaveClick,
    handleImageSave,
    setName,
    setUsername,
    resetImage,
  };
};
