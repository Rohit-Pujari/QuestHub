import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";


interface NavLink{
    name: string;
    path: string;
}
interface INavBar{
    navLinks: NavLink[];
}

const NavBar: React.FC<INavBar> = ({ navLinks}) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Logo />
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="hover:text-indigo-400 transition duration-300"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          className="text-white focus:outline-none"
          aria-label="Toggle navigation"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Nav Links */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 z-50 shadow-lg md:hidden">
          <div className="flex flex-col items-start p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="w-full text-left hover:text-indigo-400 transition duration-300"
                onClick={() => setMobileMenuOpen(false)} // Close menu on link click
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
export default NavBar;
