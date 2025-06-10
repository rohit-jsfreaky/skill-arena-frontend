import NotLoginCard from "@/components/my-ui/NotLoginCard";
import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { isSignedIn } = useUser();

  return (
    <div
      className={`${
        !isSignedIn && "justify-center flex items-center"
      } bg-gradient-to-r from-black via-black to-[#BBF429] text-white min-h-screen`}
      style={{ minHeight: "calc(100vh - 108px)" }}
    >
      {!isSignedIn ? <NotLoginCard /> : <div className="text-white">rohit</div>}
    </div>
  );
};

export default Dashboard;
