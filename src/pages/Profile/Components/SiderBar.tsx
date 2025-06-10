import { Menu, X } from "lucide-react";
import React from "react";

interface SideBarProps {
  isMobileMenuOpen: boolean;
  selectedOption: number;
  toggleMobileMenu: () => void;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
}

const SiderBar: React.FC<SideBarProps> = ({
  toggleMobileMenu,
  isMobileMenuOpen,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="md:hidden absolute right-2 top-1  z-50 bg-[#BBF429] p-2 rounded-full shadow-md"
        aria-label="Toggle conversation list"
      >
        {!isMobileMenuOpen ? <Menu /> : <X />}
      </button>

      <div
        className={`${
          isMobileMenuOpen ? "translate-x-[-5%]" : "-translate-x-[120%]"
        } md:translate-x-0 transition-transform duration-300 ease-in-out absolute md:relative z-40 w-72 h-full bg-black border-r border-[#BBF429]/30 flex flex-col `}
      >
        <div className="overflow-y-auto flex-1">
          <ul className="divide-y divide-[#BBF429]/20">
            <li
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 hover:bg-[#BBF429]/20 ${
                selectedOption === 0 ? "bg-[#BBF429]/30" : ""
              }`}
              onClick={() => {
                setSelectedOption(0);
                toggleMobileMenu();
              }}
            >
              <div className="flex flex-col items-start pl-2">
                <span className="ml-0 text-white mt-2 font-medium w-[50vw] md:w-48 text-xs md:text-xl break-words">
                  Your Profile
                </span>
              </div>
            </li>

            <li
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 hover:bg-[#BBF429]/20 ${
                selectedOption === 1 ? "bg-[#BBF429]/30" : ""
              }`}
              onClick={() => {
                setSelectedOption(1);
                toggleMobileMenu();
              }}
            >
              <div className="flex flex-col items-start pl-2">
                <span className="ml-0 text-white mt-2 font-medium w-[50vw] md:w-48 text-xs md:text-xl break-words">
                Notifications
                </span>
              </div>
            </li>

            <li
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 hover:bg-[#BBF429]/20 ${
                selectedOption === 2 ? "bg-[#BBF429]/30" : ""
              }`}
              onClick={() => {
                setSelectedOption(2);
                toggleMobileMenu();
              }}
            >
              <div className="flex flex-col items-start pl-2">
                <span className="ml-0 text-white mt-2 font-medium w-[50vw] md:w-48 text-xs md:text-xl break-words">
                  Transactions
                </span>
              </div>
            </li>

            <li
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 hover:bg-[#BBF429]/20 ${
                selectedOption === 3 ? "bg-[#BBF429]/30" : ""
              }`}
              onClick={() => {
                setSelectedOption(3);
                toggleMobileMenu();
              }}
            >
              <div className="flex flex-col items-start pl-2">
                <span className="ml-0 text-white mt-2 font-medium w-[50vw] md:w-48 text-xs md:text-xl break-words">
                Global Chat 
                </span>
              </div>
            </li>

            <li
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 hover:bg-[#BBF429]/20 ${
                selectedOption === 4 ? "bg-[#BBF429]/30" : ""
              }`}
              onClick={() => {
                setSelectedOption(4);
                toggleMobileMenu();
              }}
            >
              <div className="flex flex-col items-start pl-2">
                <span className="ml-0 text-white mt-2 font-medium w-[50vw] md:w-48 text-xs md:text-xl break-words">
                  Games History
                </span>
              </div>
            </li>

            <li
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 hover:bg-[#BBF429]/20 ${
                selectedOption === 5 ? "bg-[#BBF429]/30" : ""
              }`}
              onClick={() => {
                setSelectedOption(5);
                toggleMobileMenu();
              }}
            >
              <div className="flex flex-col items-start pl-2">
                <span className="ml-0 text-white mt-2 font-medium w-[50vw] md:w-48 text-xs md:text-xl break-words">
                  Wallet History
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SiderBar;
