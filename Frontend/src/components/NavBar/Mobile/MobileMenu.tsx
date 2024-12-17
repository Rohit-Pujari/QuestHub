import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface MobileMenuProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ toggleMobileMenu,isMobileMenuOpen }) => (
  <div className="md:hidden">
    <button
      className="text-white focus:outline-none"
      onClick={toggleMobileMenu}
      aria-label="Toggle Mobile Menu"
    >
      <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="xl" />
    </button>
  </div>
);

export default MobileMenu;
