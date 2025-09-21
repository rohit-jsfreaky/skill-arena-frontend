import { useState } from "react";
import "../personalChat/ChatPage.css";
import SiderBar from "./Components/SiderBar";
import ProfileArea from "./Components/ProfileArea";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useMYUser } from "@/context/UserContext";
import NotLoginCard from "@/components/my-ui/NotLoginCard";
import LogoutAlert from "@/components/layout/LogoutAlert";
import GlobalChatRoom from "@/components/chat/GlobalChatRoom";
import { useNavigate } from "react-router";
import UserTransactions from "./Components/UserTransactions";
import ProfileHeader from "./Components/ProfileHeader";
import ProfileDetailsSection from "./Components/ProfileDetailsSection";
import { useUserProfile } from "./useUserProfile";
import TournamentHistory from "./Components/TournamentHistory";
import TournamentFinancials from "./Components/TournamentFinancials";
import UserNotifications from "./Components/UserNotifications";

const ProfileSecond = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const { myUser, fetchUser } = useMYUser();
  const navigate = useNavigate();

  const profileData = useUserProfile();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isSignedIn || !myUser) {
    return (
      <div
        className={`${
          !isSignedIn && "justify-center flex items-center"
        } bg-black text-white min-h-screen`}
        style={{ minHeight: "calc(100vh - 108px)" }}
      >
        <NotLoginCard />
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedOption) {
      case 0:
        return (
          <>
            <ProfileArea title="Profile Details" />
            <div className="flex flex-col gap-8 overflow-y-auto p-4">
              <ProfileDetailsSection
                profileData={{ ...profileData, myUser }}
                setAlertOpen={setAlertOpen}
                setSelectedOption={setSelectedOption}
                fetchUser={fetchUser}
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <ProfileArea title="Notifications" />
            <div className="flex flex-col overflow-y-auto">
              {myUser && <UserNotifications userId={myUser.id} />}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <ProfileArea title="Transactions History" />
            <div className="flex flex-col gap-8 overflow-y-auto p-4">
              {myUser && <UserTransactions userId={myUser.id} />}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <ProfileArea title="Global Chat" />
            <div className="w-full h-full flex justify-center items-center">
              {myUser && <GlobalChatRoom user={myUser} />}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <ProfileArea title="Games History" />
            <div className="flex flex-col gap-8 overflow-y-auto p-4">
              {myUser && <TournamentHistory userId={myUser.id} />}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <ProfileArea title="Wallet History" />
            <div className="flex flex-col gap-8 overflow-y-auto p-4">
              {myUser && <TournamentFinancials userId={myUser.id} />}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chat-page">
      <>
        <ProfileHeader />

        <div className="flex border border-white rounded-2xl h-[80vh] relative bg-black overflow-x-hidden">
          <SiderBar
            isMobileMenuOpen={isMobileMenuOpen}
            selectedOption={selectedOption}
            toggleMobileMenu={toggleMobileMenu}
            setSelectedOption={setSelectedOption}
          />

          <div className="flex-1 flex flex-col h-full">{renderContent()}</div>
        </div>
      </>

      <LogoutAlert
        alertOpen={alertOpen}
        setAlertOpen={setAlertOpen}
        signOut={signOut}
        navigate={navigate}
      />
    </div>
  );
};

export default ProfileSecond;
