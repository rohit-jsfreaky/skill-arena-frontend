import NotLoginCard from "@/components/my-ui/NotLoginCard";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ProfileImage from "./Components/ProfileImage";
import NameAndUserName from "./Components/NameAndUserName";
import StatsCard from "./Components/StatsCard";
import { Button } from "@/components/ui/button";
import { useMYUser } from "@/context/UserContext";
import { updateUser } from "@/api/user";
import { useAuthToken } from "@/context/AuthTokenContext";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/my-ui/Loader";

const Profile = () => {
  const { isSignedIn, user } = useUser();
  const { myUser } = useMYUser();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [name, setName] = useState(myUser?.name || "");
  const [username, setUsername] = useState(myUser?.username || "");
  const [actualUsername, setActualUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const [isNameSaveLoading, setIsNameSaveLoading] = useState(false);

  const { authToken } = useAuthToken();
  const { fetchUser } = useMYUser();

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
        token: authToken,
      });

      if (response) {
        if (response.success) {
          console.log(response.success);
          toast.success(response.success, {
            classNames: {
              toast: "bg-green-100! border border-green-500! text-green-700!",
            },
          });
          if (user?.primaryEmailAddress?.emailAddress) {
            fetchUser(user?.primaryEmailAddress?.emailAddress);
          }

          setSelectedImage(null);
          setActualUsername(username);
        } else if (response.error) {
          toast.error(response.error, {
            classNames: {
              toast: "bg-red-100! border border-red-500! text-red-700!",
            },
          });
          console.log(response.error);
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
        token: authToken,
      });

      if (response) {
        if (response.success) {
          console.log(response.success);
          toast.success(response.success, {
            classNames: {
              toast: "bg-green-100! border border-green-500! text-green-700!",
            },
          });
          if (user?.primaryEmailAddress?.emailAddress) {
            fetchUser(user?.primaryEmailAddress?.emailAddress);
          }

          setSelectedImage(null);
        } else if (response.error) {
          toast.error(response.error, {
            classNames: {
              toast: "bg-red-100! border border-red-500! text-red-700!",
            },
          });
          console.log(response.error);
        }
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    setName(user?.fullName || "");
  }, [user]);

  return (
    <div
      className={`${
        !isSignedIn && "justify-center flex min-h-screen items-center"
      } bg-gradient-to-r from-black via-black to-[#BBF429] text-white min-h-screen py-8 px-6 sm:px-12 md:px-20 lg:px-40 xl:px-60`}
      style={{ minHeight: "calc(100vh - 108px)" }}
    >
      {!isSignedIn ? (
        <NotLoginCard />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row p-4 sm:p-6 items-center lg:items-start gap-4 sm:gap-6 w-full max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
              <ProfileImage
                handleImageChange={handleImageChange}
                user={user}
                imageUrl={imageUrl}
              />
              {selectedImage && (
                <>
                  <div className="flex justify-center gap-5">
                    <Button
                      onClick={() => {
                        setImageUrl(myUser?.profile ?? user?.imageUrl ?? null);
                        setSelectedImage(null);
                      }}
                      variant={"ghost"}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleImageSave} variant={"secondary"}>
                      {loading ? (
                        <LoadingSpinner color="green" size={24} />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>

            <NameAndUserName
              handleCancelClick={handleCancelClick}
              handleEditNameClick={handleEditNameClick}
              handleEditUsernameClick={handleEditUsernameClick}
              handleSaveClick={handleSaveClick}
              isEditingName={isEditingName}
              isEditingUsername={isEditingUsername}
              name={name}
              setName={setName}
              username={username}
              setUsername={setUsername}
              actualUsername={actualUsername}
              isNameSaveLoading={isNameSaveLoading}
            />
          </div>

          <div className="flex justify-center items-center flex-col lg:flex-row gap-4 sm:gap-6 w-full max-w-5xl mx-auto">
            <StatsCard title="Total Games" />
            <StatsCard title="Match Wins" />
            <StatsCard title="Score" />
            <StatsCard title="Win Rate" />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
