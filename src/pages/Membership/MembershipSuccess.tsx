import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useMYUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";

const MembershipSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { fetchUser, myUser } = useMYUser();

  useEffect(() => {
    if (myUser?.email) {
      fetchUser(myUser.email);
    }
    
    // If user navigates to this page directly without payment, redirect to memberships
    const timer = setTimeout(() => {
      navigate("/membership");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [fetchUser, myUser, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black via-black to-[#BBF429]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-black/80 border border-[#BBF429]/30 rounded-xl p-8 md:p-12 max-w-md mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-[#BBF429]/20 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-[#BBF429]" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
        
        <p className="text-gray-300 mb-6">
          Your membership has been activated successfully. You now have access to premium features and tournaments.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/tournaments")}
            className="bg-[#BBF429] text-black hover:bg-[#d4ff56]"
          >
            Explore Tournaments
          </Button>
          
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-[#BBF429]/50 hover:bg-[#BBF429]/10"
          >
            Go to Home
          </Button>
        </div>
        
        <p className="text-gray-400 text-sm mt-8">
          Redirecting to membership page in 5 seconds...
        </p>
      </motion.div>
    </div>
  );
};

export default MembershipSuccess;
