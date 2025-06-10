import { motion } from "framer-motion";

type UserImageProps = {
    profile: string | null;
    username: string;
}

const UserImage = ({ profile, username }:UserImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="md:w-1/3 h-64 md:h-auto relative overflow-hidden"
    >
      {profile ? (
        <img
          src={profile}
          alt={username}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-7xl font-bold text-[#BBF429]"
          >
            {username.charAt(0).toUpperCase()}
          </motion.span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 pointer-events-none"></div>
    </motion.div>
  );
};

export default UserImage;
