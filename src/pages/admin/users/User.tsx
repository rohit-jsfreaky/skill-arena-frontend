import { getUserById } from "@/api/admin/users";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import UserNotFound from "@/components/users/UserNotFound";
import { UserContextType } from "@/context/UserContext";
import { showErrorToast } from "@/utils/toastUtils";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import UserCard from "@/components/users/UserCard";

const User = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserContextType | null>(null);

  useEffect(() => {
    const getUser = async () => {
      if (id) {
        try {
          const res = await getUserById(parseInt(id), setLoading);
          if (res.success) {
            setUser(res.data || null);
          } else {
            showErrorToast(res.message);
          }
        } catch (error) {
          showErrorToast("An error occurred while fetching user details");
          console.error(error);
        }
      } else {
        showErrorToast("User ID is undefined");
      }
    };
    getUser();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center bg-black">
        <LoadingSpinner color="white" size={70} />
      </div>
    );
  }

  if (!user) {
    return <UserNotFound />;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <div className="w-full h-full bg-black p-2 pt-14 md:p-8 md:pt-14">
      <UserCard
        container={container}
        formatDate={formatDate}
        item={item}
        user={user}
      />
    </div>
  );
};

export default User;
