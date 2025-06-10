import { useState, useEffect, RefObject } from 'react';
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useAuthToken } from "@/context/AuthTokenContext";
import { useMYUser } from "@/context/UserContext";
import { createUser } from "@/api/user";
import { toast } from "sonner";

export const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [openDesktopWalletPopover, setOpenDesktopWalletPopover] = useState(false);
  const [openMobileWalletPopover, setOpenMobileWalletPopover] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [referAlertOpen, setReferAlertOpen] = useState(false);
  const [referCode, setReferCode] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { authToken } = useAuthToken();
  const { setUser, myUser } = useMYUser();

  const getRandomLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  };

  const handleClickOutside = (drawerRef: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      const handler = (event: MouseEvent) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handler);
      }

      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }, [isOpen]);
  };

  const handleDepositSuccess = () => {
    setDepositDialogOpen(false);
    refreshUserData();
  };

  const handleWithdrawSuccess = () => {
    setWithdrawDialogOpen(false);
    refreshUserData();
  };

  const refreshUserData = () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      createUser({
        data: {
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          profile: user.imageUrl,
        },
        setUser,
        setReferAlertOpen,
      });
    }
  };

  useEffect(() => {
    if (myUser) {
      setImageUrl(myUser.profile);
    }
  }, [myUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (isSignedIn && authToken !== null) {
        const userData = {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          profile: user.imageUrl,
        };
        const result = await createUser({
          data: userData,
          setUser,
          setReferAlertOpen,
        });

        if (result.success) {
          toast.success(result.message, {
            classNames: {
              toast: "bg-green-100! border border-green-500! text-green-700!",
            },
          });
        } else if (!result.message.includes("User already registered")) {
          toast.error(result.message, {
            classNames: {
              toast: "bg-red-100! border border-red-500! text-red-700!",
            },
          });
        }
      }
    };

    fetchData();
  }, [isSignedIn, user, authToken]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return {
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
  };
};