"use client";
import React from "react";
import SidebarToggle from "./SidebarToggle";
import Logo from "../Logo/Logo";
import UserMenu from "./UserMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTheme: () => void;
  darkMode:boolean;
}> = ({ isSidebarOpen, setIsSidebarOpen, toggleTheme,darkMode }) => {
  return (
    <nav className="flex items-center justify-between bg-gray-900 h-14 px-4 shadow-md">
      <div className="flex items-center space-x-4">
        <SidebarToggle isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Logo />
      </div>
      <div className="flex items-center space-x-4">
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="text-white px-4 py-2 rounded-md focus:outline-none"
        >
          <FontAwesomeIcon icon={darkMode? faMoon:faSun} />
        </button>
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
