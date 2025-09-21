import { useMYUser } from "@/context/UserContext";
import "./ChatPage.css";
import PersonalChat from "@/components/personalChat/PersonalChat";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import NotLoginCard from "@/components/my-ui/NotLoginCard";
const PersonalChatPage = () => {
  const { myUser, fetchUser } = useMYUser();
  const { user } = useUser();

  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!myUser) {
      if (user?.primaryEmailAddress?.emailAddress) {
        fetchUser(user?.primaryEmailAddress?.emailAddress);
      }
    }
  }, [myUser]);

  if (!isSignedIn || !myUser) {
    return (
      <div
        className={`${
          !isSignedIn && "justify-center flex items-center"
        } bg-black text-white min-h-screen`}
        style={{ minHeight: "calc(100vh - 108px)" }}
      >
        <NotLoginCard />
      </div>
    );
  }

  return (
    <div className="chat-page">
      <h2 className="text-white text-3xl sm:text-4xl md:text-5xl mb-5">Chat</h2>

      <PersonalChat currentUser={myUser} />
    </div>
  );
};

export default PersonalChatPage;
