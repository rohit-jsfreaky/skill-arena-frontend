import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
} from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { 
  Home, 
  Trophy, 
  BarChart3, 
  User, 
  Crown, 
  MessageCircle,
  Wallet,
  Info,
  Gamepad2,
  Phone,
  ChevronRight
} from "lucide-react";
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
  setIsOpen: (isOpen: boolean) => void;
}

const MobileLayout = ({
  isOpen,
  drawerRef,
  drawerVariants,
  profileSrc,
  displayLetter,
  setIsOpen,
}: MobileLayoutProps) => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  // Function to handle navigation and close sidebar
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Navigation groups with main headings and sub-links
  const navigationGroups = [
    {
      title: "Main",
      icon: Home,
      items: [
        { label: "Home", path: "/", icon: Home },
        { label: "About", path: "/about", icon: Info },
      ]
    },
    {
      title: "Gaming",
      icon: Gamepad2,
      items: [
        { label: "Tournaments", path: "/tournaments", icon: Trophy },
        { label: "TDM", path: "/tdm", icon: Gamepad2 },
        { label: "Leaderboard", path: "/leaderboard", icon: BarChart3 },
      ]
    },
    {
      title: "Profile",
      icon: User,
      items: [
        { label: "My Profile", path: "/profile", icon: User },
        { label: "Membership", path: "/membership", icon: Crown },
      ]
    },
    {
      title: "Communication",
      icon: MessageCircle,
      items: [
        { label: "Global Chat", path: "/chat", icon: MessageCircle },
        { label: "Personal Chat", path: "/personal", icon: MessageCircle },
        { label: "Contact Us", path: "/contact", icon: Phone },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={drawerRef}
          variants={drawerVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="absolute top-0 left-0 h-screen w-72 bg-[#BBF429] text-black flex flex-col py-6 md:hidden z-[1000] overflow-y-auto"
        >
          <div className="px-6 mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">Menu</h2>
            <div className="w-12 h-1 bg-black rounded"></div>
          </div>

          <div className="flex-1 px-4">
            {navigationGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                {/* Group Header */}
                <div className="flex items-center gap-2 px-2 py-2 mb-2">
                  <group.icon className="h-5 w-5 text-black opacity-70" />
                  <h3 className="text-lg font-semibold text-black opacity-90 uppercase tracking-wide">
                    {group.title}
                  </h3>
                </div>
                
                {/* Group Items */}
                <ul className="space-y-1 ml-2">
                  {group.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/10 transition-all duration-200 group w-full text-left"
                      >
                        <item.icon className="h-4 w-4 text-black/70 group-hover:text-black transition-colors" />
                        <span className="text-black/80 group-hover:text-black font-medium transition-colors">
                          {item.label}
                        </span>
                        <ChevronRight className="h-3 w-3 text-black/40 ml-auto group-hover:translate-x-1 transition-transform" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* User Section */}
          <SignedIn>
            <div className="border-t border-black/20 pt-4 px-6">
              <div className="flex items-center gap-3 mb-4">
                {profileSrc ? (
                  <img
                    src={profileSrc}
                    alt="Profile"
                    className="h-12 w-12 rounded-full border-2 border-black/20"
                  />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center bg-black/20 text-black text-lg font-semibold rounded-full">
                    {displayLetter}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-black">Account</p>
                  <p className="text-xs text-black/60">Manage your profile</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => handleNavigation("/profile")}
                  variant={"secondary"}
                  className="w-full justify-start gap-2 bg-black/10 hover:bg-black/20 text-black border-none"
                >
                  <User className="h-4 w-4" />
                  View Profile
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="w-full justify-start gap-2 text-red-700 hover:bg-red-100 hover:text-red-800"
                    >
                      <Wallet className="h-4 w-4" />
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
            <div className="border-t border-black/20 pt-4 px-6">
              <div className="rounded-lg bg-black/10 p-4 text-center">
                <p className="text-sm text-black/70 mb-3">Sign in to access all features</p>
                <SignInButton>
                  <Button className="w-full bg-black text-[#BBF429] hover:bg-black/90">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileLayout;
