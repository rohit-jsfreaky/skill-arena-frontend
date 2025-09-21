import { motion } from "framer-motion";
import UserImage from "./UserImage";
import UserTitle from "./UserTitle";
import UsernameAndEmail from "./UsernameAndEmail";
import UserWallet from "./UserWallet";
import UserJoined from "./UserJoined";
import UserGamesPlayed from "./UserGamesPlayed";
import UserWins from "./UserWins";
import UserWinRate from "./UserWinRate";
import UserMembership from "./UserMembership";
import UserReferral from "./UserReferral";
import UserAppliedReferral from "./UserAppliedReferral";
import UserActions from "./UserActions";
import { UserContextType } from "@/context/UserContext";

type UserCardProps = {
  user: UserContextType;
  container: {
    hidden: {
      opacity: number;
    };
    show: {
      opacity: number;
      transition: {
        staggerChildren: number;
        delayChildren: number;
      };
    };
  };
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
};
const UserCard = ({ user, container, item, formatDate }: UserCardProps) => {
  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-black border-2 border-[#BBF429] rounded-lg shadow-xl overflow-hidden backdrop-blur-sm"
      >
        <div className="flex flex-col md:flex-row">
          {/* Profile Image Section */}
          <UserImage profile={user.profile} username={user.username} />

          {/* User Info Section */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="md:w-2/3 p-6 text-white"
          >
            <UserTitle
              item={item}
              membership_id={user.membership_id}
              username={user.username}
            />

            <UsernameAndEmail email={user.email} item={item} name={user.name} />

            <motion.div
              variants={container}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8"
            >
              <UserWallet item={item} wallet={user.wallet} />

              <UserJoined
                created_at={user.created_at}
                formatDate={formatDate}
                item={item}
              />

              <UserGamesPlayed
                item={item}
                total_games_played={user.total_games_played}
              />

              <UserWins item={item} total_wins={user.total_wins} />

              <UserWinRate
                item={item}
                total_games_played={user.total_games_played}
                total_wins={user.total_wins}
              />

              <UserMembership
                formatDate={formatDate}
                item={item}
                membership_expiry={user.membership_expiry}
              />

              <UserReferral item={item} referral_code={user.referral_code} />

              <UserAppliedReferral
                applied_referral={user.applied_referral}
                item={item}
              />
            </motion.div>

            {/* Action Buttons */}
            {/* <UserActions container={container} id={user.id} item={item} /> */}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserCard;
