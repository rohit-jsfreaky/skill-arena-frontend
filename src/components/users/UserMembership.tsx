import { motion } from "framer-motion";

type UserMembershipProps = {
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
  membership_expiry: string | null | undefined;
  formatDate: (dateString: string) => string;
};
const UserMembership = ({
  item,
  membership_expiry,
  formatDate,
}: UserMembershipProps) => {
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
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Membership Expires
      </h3>
      <p className="mt-2">
        {membership_expiry ? formatDate(membership_expiry) : "N/A"}
      </p>
    </motion.div>
  );
};

export default UserMembership;
