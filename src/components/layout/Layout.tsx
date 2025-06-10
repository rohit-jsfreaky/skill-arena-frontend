import Navbar from "./Navbar";

import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gradient-to-r from-black via-black to-[#BBF429]">{children}</div>
    </div>
  );
};

export default Layout;
