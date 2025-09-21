import { useRef } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useNavbar } from "@/hooks/useNavbar";
import { NavbarLogo } from "./NavbarLogo";
import { DesktopMenu } from "./DesktopMenu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import MobileLayout from "./MobileLayout";
import ReferDialog from "./ReferDialog";
import LogoutAlert from "./LogoutAlert";
import DepositDialog from "./DepositDialog";
import WithdrawDialog from "./WithdrawDialog";
import WalletButton from "./WalletButton";

const Navbar = () => {
  const drawerRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const {
    isOpen,
    setIsOpen,
    openPopover,
    setOpenPopover,
    openDesktopWalletPopover,
    setOpenDesktopWalletPopover,
    openMobileWalletPopover,
    setOpenMobileWalletPopover,
    depositDialogOpen,
    setDepositDialogOpen,
    withdrawDialogOpen,
    setWithdrawDialogOpen,
    alertOpen,
    setAlertOpen,
    referAlertOpen,
    setReferAlertOpen,
    referCode,
    setReferCode,
    imageUrl,
    user,
    myUser,
    navigate,
    signOut,
    getRandomLetter,
    handleClickOutside,
    handleDepositSuccess,
    handleWithdrawSuccess,
  } = useNavbar();

  handleClickOutside(drawerRef);

  const drawerVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const profileSrc = user?.imageUrl;
  const displayLetter = user?.firstName?.charAt(0) || getRandomLetter();

  return (
    <nav className="flex top-0 items-center justify-between pt-2 bg-gradient-to-r from-black via-black to-[#BBF429] text-white">
      <NavbarLogo />
      <DesktopMenu />
      
      {/* Rest of your JSX remains the same, just using the hooks values */}
      <div className="hidden  px-4 md:flex  items-center gap-10 ">
        <SignedIn>
          <WalletButton
            myUser={myUser}
            openWalletPopover={openDesktopWalletPopover}
            setOpenWalletPopover={setOpenDesktopWalletPopover}
            setDepositDialogOpen={setDepositDialogOpen}
            setWithdrawDialogOpen={setWithdrawDialogOpen}
          />
          <div className="text-white hover:scale-110 transition duration-100">
            <Link to={"/personal"}>
              <MessageCircle />
            </Link>
          </div>

          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
              {profileSrc ? (
                <img
                  onClick={() => setOpenPopover((prev) => !prev)}
                  src={imageUrl || profileSrc}
                  alt="Profile"
                  className="h-10 w-10 cursor-pointer rounded-full"
                />
              ) : (
                <div
                  onClick={() => setOpenPopover((prev) => !prev)}
                  className="h-10 w-10 flex items-center justify-center bg-gray-500 text-white text-lg font-semibold rounded-full cursor-pointer"
                >
                  {displayLetter}
                </div>
              )}
            </PopoverTrigger>
            <PopoverContent className="  md:block w-40 sm:w-48 md:w-56 lg:w-64 p-3 mr-2 rounded-lg shadow-lg bg-gradient-to-r from-[#EAFFA9] to-[#BBF429] border border-gray-200 hidden flex-col space-y-2">
              <Button
                onClick={() => navigate("/profile")}
                variant={"secondary"}
                className="w-full px-4 py-2 text-sm font-medium text-black hover:bg-white hover:text-black rounded-md transition"
              >
                Profile
              </Button>
              <Button
                variant={"ghost"}
                className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md transition"
                onClick={() => {
                  setAlertOpen(true);
                }}
              >
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </SignedIn>
        <SignedOut>
          <div className="rounded-2xl text-black bg-[linear-gradient(90deg,#BBF429_-40%,transparent_100%)] hover:bg-white transition duration-300 px-6 py-2.5">
            <SignInButton />
          </div>
        </SignedOut>
      </div>

      <div className="md:hidden px-4">
        {isOpen ? (
          <X size={30} onClick={() => setIsOpen(false)} />
        ) : (
          <div className="flex items-center gap-5">
            <SignedIn>
              <WalletButton
                myUser={myUser}
                isMobile={true}
                openWalletPopover={openMobileWalletPopover}
                setOpenWalletPopover={setOpenMobileWalletPopover}
                setDepositDialogOpen={setDepositDialogOpen}
                setWithdrawDialogOpen={setWithdrawDialogOpen}
              />
              <Link to={"/personal"}>
                <MessageCircle />
              </Link>
            </SignedIn>
            <Menu size={30} onClick={() => setIsOpen(true)} />
          </div>
        )}
      </div>

      <MobileLayout
        displayLetter={displayLetter}
        profileSrc={imageUrl ? imageUrl : profileSrc}
        isOpen={isOpen}
        drawerRef={drawerRef}
        drawerVariants={drawerVariants}
        setIsOpen={setIsOpen}
      />

      <LogoutAlert
        alertOpen={alertOpen}
        setAlertOpen={setAlertOpen}
        signOut={signOut}
        navigate={navigate}
      />

      <ReferDialog
        referCode={referCode}
        setReferCode={setReferCode}
        referAlertOpen={referAlertOpen}
        setReferAlertOpen={setReferAlertOpen}
      />

      <DepositDialog
        open={depositDialogOpen}
        setOpen={setDepositDialogOpen}
        myUser={myUser}
        onSuccess={handleDepositSuccess}
      />

      <WithdrawDialog
        open={withdrawDialogOpen}
        setOpen={setWithdrawDialogOpen}
        myUser={myUser}
        onSuccess={handleWithdrawSuccess}
      />
    </nav>
  );
};

export default Navbar;
