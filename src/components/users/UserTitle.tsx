import { motion } from "framer-motion";

type UserTitleProps = {
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
  username: string;
  membership_id: number;
};

const UserTitle = ({ item, username, membership_id }: UserTitleProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 w-full">
      <motion.h1
        variants={item}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold 
        mb-1 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r 
        from-white to-[#BBF429] max-w-[280px] sm:max-w-[400px] 
        md:max-w-[500px] lg:max-w-[600px]"
      >
        {username}
      </motion.h1>
      <motion.span
        variants={item}
        className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm 
        font-medium bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg 
        transform hover:scale-105 transition-transform"
      >
        {membership_id > 0 ? "Pro Member" : "Regular Member"}
      </motion.span>
    </div>
  );
};

export default UserTitle;
