import { motion } from "framer-motion";
type UserReferralProps = {
  item: {
    hidden: {
      y: number;
      opacity: number;
    };
    show: {
      y: number;
      opacity: number;
      transition: {
        type: string;
        stiffness: number;
      };
    };
  };
  referral_code: string | null | undefined;
};
const UserReferral = ({ item, referral_code }: UserReferralProps) => {
  return (
    <motion.div
      variants={item}
      className="bg-black/30 p-4 rounded-lg border border-[#BBF429]/30 hover:border-[#BBF429] transition-all"
    >
      <h3 className="text-sm font-semibold text-[#eaffa9] uppercase flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          />
        </svg>
        Referral Code
      </h3>
      <p className="mt-2 font-mono">{referral_code}</p>
    </motion.div>
  );
};

export default UserReferral;
