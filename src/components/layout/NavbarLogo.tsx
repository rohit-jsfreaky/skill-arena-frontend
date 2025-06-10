import { Link } from "react-router-dom";

export const NavbarLogo = () => (
  <div className="flex items-center px-4">
    <Link to="/">
      <img src="/Logo-white.png" width={100} height={20} alt="Logo" />
    </Link>
  </div>
);