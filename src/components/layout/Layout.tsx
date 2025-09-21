import Navbar from "./Navbar";
import BottomTabs from "./BottomTabs";

import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-black pb-16 md:pb-0">
        {children}
      </div>
      <BottomTabs />
    </div>
  );
};

export default Layout;
