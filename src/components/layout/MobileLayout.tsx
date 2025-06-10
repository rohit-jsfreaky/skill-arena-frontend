import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
} from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface MobileLayoutProps {
  isOpen: boolean;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  drawerVariants: {
    open: {
      x: number;
      transition: {
        type: string;
        stiffness: number;
        damping: number;
      };
    };
    closed: {
      x: string;
      transition: {
        type: string;
        stiffness: number;
        damping: number;
      };
    };
  };
  profileSrc: string | undefined;
  displayLetter: string;
}

const MobileLayout = ({
  isOpen,
  drawerRef,
  drawerVariants,
  profileSrc,
  displayLetter,
}: MobileLayoutProps) => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={drawerRef}
          variants={drawerVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="absolute top-0 left-0 h-screen w-64 bg-[#BBF429] text-black flex flex-col items-start gap-4 py-8 px-6 md:hidden z-[1000] overflow-y-auto"
        >
          <ul className="flex flex-col gap-3 text-lg w-full">
            <li>
              <Link
                to="/"
                className="hover:text-white transition duration-300 w-full"
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-white transition duration-300 w-full"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/tournaments"
                className="hover:text-white transition duration-300 w-full"
              >
                TOURNAMENT
              </Link>
            </li>
            <li>
              <Link
                to="/tdm"
                className="hover:text-white transition duration-300 w-full"
              >
                TDM
              </Link>
            </li>
            <li>
              <Link
                to="/leaderboard"
                className="hover:text-white transition duration-300 w-full"
              >
                LEADERBOARD
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:text-white transition duration-300 w-full"
              >
                PROFILE
              </Link>
            </li>
            <li>
              <Link
                to="/membership"
                className="hover:text-white transition duration-300 w-full"
              >
                MEMBERSHIP
              </Link>
            </li>
          </ul>

          <SignedIn>
            <div className="relative flex flex-col items-center space-y-2 md:hidden">
              {profileSrc ? (
                <img
                  src={profileSrc}
                  alt="Profile"
                  className="h-12 w-12 rounded-full cursor-pointer"
                />
              ) : (
                <div className="h-12 w-12 flex items-center justify-center bg-gray-500 text-white text-lg font-semibold rounded-full cursor-pointer">
                  {displayLetter}
                </div>
              )}

              <div className="flex flex-col w-full max-w-[150px] space-y-2">
                <Button
                  onClick={() => navigate("/profile")}
                  variant={"secondary"}
                  className="w-full px-4 py-2 text-sm font-medium text-black hover:bg-white hover:text-black rounded-md transition"
                >
                  Profile
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md transition"
                    >
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gradient-to-r from-[#EAFFA9] to-[#BBF429]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be logged out of your account. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          signOut();
                          navigate("/");
                        }}
                      >
                        Logout
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="mt-4 w-full flex justify-center">
              <SignInButton />
            </div>
          </SignedOut>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileLayout;
