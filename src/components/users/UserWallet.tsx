import { motion } from "framer-motion";

type UserWalletProps = {
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
  wallet: number | null | undefined;
};
const UserWallet = ({ item, wallet }: UserWalletProps) => {
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
            d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
          />
        </svg>
        Wallet Balance
      </h3>
      <p className="mt-2 text-xl font-bold">${wallet || 0}</p>
    </motion.div>
  );
};

export default UserWallet;
