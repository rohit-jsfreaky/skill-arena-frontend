import React from "react";
import { motion } from "framer-motion";
import { MembershipPlan, UserMembership } from "@/hooks/useUserMembership";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { CheckCircle2, Trophy, Zap, Shield, Users, Crown } from "lucide-react";

interface MembershipPlansProps {
  plans: MembershipPlan[];
  userMembership: UserMembership | null;
  loading: boolean;
  purchaseLoading: boolean;
  purchaseMembership: (planId: number) => Promise<void>;
  formatDuration: (duration: any) => string;
}

const MembershipPlans: React.FC<MembershipPlansProps> = ({
  plans,
  userMembership,
  loading,
  purchaseLoading,
  purchaseMembership,
  formatDuration,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <LoadingSpinner color="#BBF429" size={40} />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center text-gray-400 my-10">
        No membership plans are currently available.
      </div>
    );
  }

  // Predefined icons for benefits
  const benefitIcons: Record<string, React.ReactNode> = {
    "tournament": <Trophy className="w-4 h-4" />,
    "priority": <Zap className="w-4 h-4" />,
    "support": <Users className="w-4 h-4" />,
    "protection": <Shield className="w-4 h-4" />,
    "premium": <Crown className="w-4 h-4" />
  };

  // Function to determine which icon to use based on benefit text
  const getBenefitIcon = (benefit: string) => {
    const lowerBenefit = benefit.toLowerCase();
    
    if (lowerBenefit.includes("tournament")) return benefitIcons["tournament"];
    if (lowerBenefit.includes("priority")) return benefitIcons["priority"];
    if (lowerBenefit.includes("support")) return benefitIcons["support"];
    if (lowerBenefit.includes("protection")) return benefitIcons["protection"];
    if (lowerBenefit.includes("premium") || lowerBenefit.includes("exclusive")) return benefitIcons["premium"];
    
    return <CheckCircle2 className="w-4 h-4" />;
  };

  return (
    <div className="my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const isActive = userMembership?.active && userMembership.plan?.id === plan.id;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`
                relative overflow-hidden rounded-2xl 
                ${isActive ? 'border-2 border-[#BBF429]' : 'border border-gray-700'} 
                shadow-xl backdrop-blur-sm
                ${plan.name.toLowerCase().includes('pro') ? 'bg-gradient-to-b from-black/80 to-[#5D1C66]/50' : 'bg-black/70'}
              `}
            >
              {isActive && (
                <div className="absolute -right-8 top-6 rotate-45 bg-[#BBF429] text-black px-10 py-1 text-sm font-bold">
                  ACTIVE
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <h3 className={`
                  text-2xl font-bold mb-2 
                  ${plan.name.toLowerCase().includes('pro') ? 'text-[#F9C567]' : 'text-white'}
                `}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-white">₹{plan.price}</span>
                  <span className="text-gray-400">/ {formatDuration(plan.duration)}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-[#BBF429] mr-3 mt-1">
                        {getBenefitIcon(benefit)}
                      </span>
                      <span className="text-gray-200">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => !isActive && purchaseMembership(plan.id)}
                  disabled={purchaseLoading || isActive}
                  className={`
                    w-full py-3 px-4 rounded-xl font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-[#BBF429]/30 text-[#BBF429] cursor-default' 
                      : 'bg-[#BBF429] text-black hover:bg-[#d4ff56] hover:shadow-lg hover:shadow-[#BBF429]/20'}
                  `}
                >
                  {purchaseLoading ? (
                    <LoadingSpinner color="black" size={20} />
                  ) : isActive ? (
                    'Current Plan'
                  ) : (
                    'Get Started'
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MembershipPlans;
