import { FaPaypal, FaBitcoin } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { useNavigate } from "react-router";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className=" pt-10 border-t-2 border-t-[#BBF429] bg-black text-white px-6 lg:px-16 py-10">
      {/* Links Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-sm text-[#EAFFA9] mt-8">
        <div>
          <h4 className="font-semibold text-[#BBF429]">COMPETITIONS</h4>
          <ul>
            <li className="mt-2 cursor-pointer" onClick={() => navigate("/")}>
              SKILL ARENA
            </li>
            <li
              className="mt-2 cursor-pointer"
              onClick={() => navigate("/tournaments")}
            >
              Tournaments
            </li>
            <li
              className="mt-2 cursor-pointer"
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#BBF429]">SUPPORT</h4>
          <ul>
            <li
              className="mt-2 cursor-pointer"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </li>
            <li className="mt-2">FAQ</li>
            <li
              className="mt-2 cursor-pointer"
              onClick={() => navigate("/about")}
            >
              About Us
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#BBF429]">DOCS</h4>
          <ul>
            <li className="mt-2">Privacy Policy</li>
            <li className="mt-2">Terms & Conditions</li>
            <li className="mt-2">How to Play</li>
            <li className="mt-2">Career</li>
            <li className="mt-2">Disclaimer</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#BBF429]">CONTENT</h4>
          <ul>
            <li className="mt-2">Blog</li>
            <li className="mt-2">FC 24 Cross Play</li>
            <li className="mt-2">Sports FC 24</li>
            <li className="mt-2">The Multifaceted...</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#BBF429]">
            SAFE & SECURE PAYMENTS
          </h4>
          <div className="flex items-center space-x-3 mt-2">
            <FaPaypal size={28} />
            <FaBitcoin size={28} />
            <FaBitcoin size={28} />
            <BsCurrencyDollar size={28} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 text-center text-xs text-gray-300">
        <p>
          All content, game titles, trade names, and trademarks belong to their
          respective owners.
        </p>
        <p className="mt-1">Over 18+ Only</p>
        <p className="mt-4">
          © 2025 — SKILL ARENA Limited. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
