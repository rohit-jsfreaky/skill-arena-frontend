import { UserContextType } from "@/context/UserContext";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef } from 'react';
import { formatCurrency } from "@/utils/formatCurrency";

interface WalletButtonProps {
  myUser: UserContextType | null;
  isMobile?: boolean;
  openWalletPopover: boolean;
  setOpenWalletPopover: (value: boolean) => void;
  setDepositDialogOpen: (value: boolean) => void;
  setWithdrawDialogOpen: (value: boolean) => void;
}

const WalletButton = ({
  myUser,
  isMobile = false,
  openWalletPopover,
  setOpenWalletPopover,
  setDepositDialogOpen,
  setWithdrawDialogOpen,
}: WalletButtonProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const walletAmount = myUser?.wallet || 0;
  const formattedAmount = formatCurrency(walletAmount);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenWalletPopover(false);
      }
    };

    if (openWalletPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openWalletPopover, setOpenWalletPopover]);

  return (
    <div ref={popoverRef} className="relative">
      <Popover open={openWalletPopover} onOpenChange={setOpenWalletPopover}>
        <PopoverTrigger asChild>
          <div
            onClick={() => setOpenWalletPopover(!openWalletPopover)}
            className={`
              border-white cursor-pointer border-2 rounded-2xl
              text-center flex items-center gap-1
              transition-all duration-200 ease-in-out
              hover:bg-white/10
              xs:px-2 xs:py-0.5
              sm:px-4 sm:py-1
              md:px-4 md:py-1.5
              lg:px-5 lg:py-2
              ${isMobile ? "px-4 py-1 text-sm" : ""}
            `}
          >
            <h1 className={`
              font-bold whitespace-nowrap
              xs:text-xs
              sm:text-sm
              md:text-base
              ${isMobile ? "text-sm" : ""}  
            `}>
              ₹{formattedAmount}
            </h1>
            <img
              src="/ruppee.png"
              alt="rupee"
              className={`
                object-contain
                xs:h-2 xs:w-2
                sm:h-3 sm:w-3
                md:h-4 md:w-4
                ${isMobile ? "h-3 w-3" : ""}
              `}
            />
            <span className="xs:text-xs sm:text-sm md:text-base">+</span>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={`
            p-3 rounded-lg shadow-lg
            bg-gradient-to-r from-[#EAFFA9] to-[#BBF429]
            border border-gray-200
            xs:w-40
            sm:w-48
            md:w-56
            lg:w-64
            ${isMobile ? "w-40" : ""}
          `}
          align="end"
        >
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setDepositDialogOpen(true)}
              variant="secondary"
              className={`
                w-full text-black transition
                hover:bg-white hover:text-black rounded-md
                xs:px-2 xs:py-1 xs:text-xs
                sm:px-3 sm:py-1.5 sm:text-sm
                md:px-4 md:py-2 md:text-base
              `}
            >
              Add Money
            </Button>
            <Button
              onClick={() => setWithdrawDialogOpen(true)}
              variant="ghost"
              className={`
                w-full text-black transition
                hover:bg-red-100 rounded-md
                xs:px-2 xs:py-1 xs:text-xs
                sm:px-3 sm:py-1.5 sm:text-sm
                md:px-4 md:py-2 md:text-base
              `}
            >
              Withdraw
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default WalletButton;
