import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-black via-black to-[#BBF429] text-white flex flex-col items-center justify-center px-4 text-center space-y-6">
      <h1 className="text-5xl md:text-7xl font-bold">404</h1>
      <h2 className="text-xl md:text-4xl lg:text-6xl font-semibold">Page Not Found</h2>

      <Button
        onClick={() => navigate("/")}
        className="text-black font-semibold bg-[#BBF429] hover:bg-[#a6db1c] px-6 py-3 text-base md:text-lg rounded-xl transition-all duration-300"
      >
        Go Back To Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
