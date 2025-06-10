import { motion } from "framer-motion";

type UserJoinedProps = {
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
  formatDate: (dateString: string) => string;
  created_at: string;
};

const UserJoined = ({ item, formatDate, created_at }: UserJoinedProps) => {
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
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
        Joined On
      </h3>
      <p className="mt-2">{formatDate(created_at)}</p>
    </motion.div>
  );
};

export default UserJoined;
