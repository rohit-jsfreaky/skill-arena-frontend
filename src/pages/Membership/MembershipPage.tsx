import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useMYUser } from "@/context/UserContext";
import { useUserMembership } from "@/hooks/useUserMembership";
import NotLoginCard from "@/components/my-ui/NotLoginCard";
import MembershipStatus from "@/components/Membership/MembershipStatus";
import MembershipPlans from "@/components/Membership/MembershipPlans";
import { motion } from "framer-motion";

const MembershipPage: React.FC = () => {
  const { isSignedIn } = useUser();
  const { myUser } = useMYUser();
  const { 
    plans, 
    userMembership, 
    loading, 
    purchaseLoading, 
    purchaseMembership, 
    formatDuration,
    getTimeRemaining
  } = useUserMembership();

  if (!isSignedIn) {
    return (
      <div
        className="bg-gradient-to-r from-black via-black to-[#BBF429] text-white min-h-screen flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 108px)" }}
      >
        <NotLoginCard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/membership-bg.jpg')] bg-cover bg-center bg-fixed bg-opacity-90">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-4">
            Skill Arena <span className="text-[#BBF429]">Memberships</span>
          </h1>
          <p className="text-lg text-center text-gray-300 max-w-3xl mx-auto mb-12">
            Join our premium membership to access exclusive tournaments, special rewards, and more!
          </p>
        </motion.div>

        {myUser && (
          <MembershipStatus 
            userMembership={userMembership}
            loading={loading}
            getTimeRemaining={getTimeRemaining}
          />
        )}

        <MembershipPlans 
          plans={plans}
          userMembership={userMembership}
          loading={loading}
          purchaseLoading={purchaseLoading}
          purchaseMembership={purchaseMembership}
          formatDuration={formatDuration}
        />
      </div>
    </div>
  );
};

export default MembershipPage;
