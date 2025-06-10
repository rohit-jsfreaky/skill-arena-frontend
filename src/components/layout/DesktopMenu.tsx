import { Link } from "react-router-dom";

export const DesktopMenu = () => (
  <ul className="hidden md:flex gap-10 px-4">
    <MenuItem to="/" label="HOME" />
    <MenuItem to="/about" label="ABOUT" />
    <MenuItem to="/tournaments" label="TOURNAMENT" />

    <MenuItem to="/tdm" label="TDM" />
    <MenuItem to="/leaderboard" label="LEADERBOARD" />
    <MenuItem to="/membership" label="MEMBERSHIP" />
  </ul>
);

const MenuItem = ({ to, label }: { to: string; label: string }) => (
  <li className="hover:scale-110 transition duration-100">
    <Link to={to} className="hover:text-[#BBF429] cursor-pointer">
      {label}
    </Link>
  </li>
);
