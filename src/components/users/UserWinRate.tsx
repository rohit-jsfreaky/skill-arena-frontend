import { motion } from "framer-motion";

type UserWinRateProps = {
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
  total_games_played: number | null | undefined;
  total_wins: number | null | undefined;
};
const UserWinRate = ({
  item,
  total_games_played,
  total_wins,
}: UserWinRateProps) => {
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
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
        Win Rate
      </h3>
      <p className="mt-2">
        {total_games_played && total_games_played > 0 ? (
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative"
          >
            <span className="text-xl font-bold">
              {Math.round(((total_wins || 0) / total_games_played) * 100)}%
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.round(
                  ((total_wins || 0) / total_games_played) * 100
                )}%`,
              }}
              transition={{ delay: 1.2, duration: 1 }}
              className="absolute bottom-0 h-1 bg-[#BBF429] rounded-full -z-10"
            ></motion.div>
          </motion.span>
        ) : (
          "N/A"
        )}
      </p>
    </motion.div>
  );
};

export default UserWinRate;
