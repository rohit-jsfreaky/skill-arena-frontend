import { useEffect } from "react";
import GlobalChatRoom from "@/components/chat/GlobalChatRoom";
import { useMYUser } from "@/context/UserContext";
import { useUser } from "@clerk/clerk-react";
import NotLoginCard from "@/components/my-ui/NotLoginCard";

const ChatPage = () => {
  const { myUser, fetchUser } = useMYUser();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!myUser) {
      if (user?.primaryEmailAddress?.emailAddress)
        fetchUser(user?.primaryEmailAddress?.emailAddress);
    }
  }, [myUser]);

  const containerClasses = `bg-gradient-to-r from-black via-black to-[#BBF429] px-10 py-10 text-white min-h-screen `;

  if (!isSignedIn || !myUser) {
    return (
      <div
        className={`${
          !isSignedIn && "justify-center flex items-center"
        } bg-gradient-to-r from-black via-black to-[#BBF429] text-white min-h-screen`}
        style={{ minHeight: "calc(100vh - 108px)" }}
      >
        <NotLoginCard />
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      style={{ minHeight: "calc(100vh - 108px)" }}
    >
      <>
        <h1 className="text-2xl text-center font-bold mb-6">Chat Room</h1>
        <div className="mb-4 text-center">
          <p>
            Welcome, <span className="font-semibold">{myUser.username}</span>!
          </p>
        </div>
        <GlobalChatRoom user={myUser} />
      </>
    </div>
  );
};

export default ChatPage;
