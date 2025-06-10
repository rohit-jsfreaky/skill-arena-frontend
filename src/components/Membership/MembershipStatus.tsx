import React from "react";
import { motion } from "framer-motion";
import { UserMembership } from "@/hooks/useUserMembership";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { RocketIcon, CalendarIcon, CheckCircle2 } from "lucide-react";

interface MembershipStatusProps {
  userMembership: UserMembership | null;
  loading: boolean;
  getTimeRemaining: (expiryDate: string) => string;
}

const MembershipStatus: React.FC<MembershipStatusProps> = ({
  userMembership,
  loading,
  getTimeRemaining,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <LoadingSpinner color="#BBF429" size={40} />
      </div>
    );
  }

  if (!userMembership?.active) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-black/70 border border-red-500/30 rounded-xl p-6 max-w-xl mx-auto mb-10 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-red-900/30 p-3 rounded-full">
            <RocketIcon className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Active Membership</h2>
        <p className="text-gray-400">
          You don't have an active membership. Upgrade now to access premium tournaments and features!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-black/70 border border-[#BBF429]/30 rounded-xl p-6 max-w-xl mx-auto mb-10"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center">
          <div className="bg-[#BBF429]/20 p-3 rounded-full mr-4">
            <CheckCircle2 className="w-8 h-8 text-[#BBF429]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Active Membership</h2>
            <p className="text-[#BBF429]">{userMembership.plan?.name || "Premium"}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-[#BBF429]/10 py-2 px-4 rounded-full">
          <CalendarIcon className="w-4 h-4 text-[#BBF429] mr-2" />
          <span className="text-white font-medium">
            {userMembership.expiresAt && getTimeRemaining(userMembership.expiresAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipStatus;
