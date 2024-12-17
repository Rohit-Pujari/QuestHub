import React from "react";
import Logo from "./Logo";
import DesktopNav from "./Desktop/DesktopNav";
import MobileNav from "./Mobile/MobileNav";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <Logo />
      {/* Desktop Nav */}
      <DesktopNav/>
      {/* Mobile Nav */}
      <MobileNav/>
    </nav>
  );
};

export default NavBar;