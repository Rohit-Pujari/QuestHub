import React from "react";
import SideItems from "./SideItems";

const Sidebar: React.FC<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <aside
      className={`bg-gray-800 text-white h-full transition-all duration-300 ${
        isSidebarOpen ? "w-48" : "w-14"
      }`}
    >
      <SideItems isSidebarOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
    </aside>
  );
};

export default Sidebar;
