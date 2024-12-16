import React from "react";
import { Link } from "react-router-dom";

interface NavLinksProps {
  navLinks: { name: string; path: string }[];
  style?: string;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ navLinks, style, onClick }) => (
  <>
    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        className={`hover:text-indigo-400 transition duration-300 ${style}`}
        onClick={onClick}
      >
        {link.name}
      </Link>
    ))}
  </>
);

export default NavLinks;
