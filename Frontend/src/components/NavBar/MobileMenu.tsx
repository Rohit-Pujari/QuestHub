import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface MobileMenuProps {
  toggleMobileMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ toggleMobileMenu }) => (
  <div className="md:hidden">
    <button
      className="text-white focus:outline-none"
      onClick={toggleMobileMenu}
      aria-label="Toggle Mobile Menu"
    >
      <FontAwesomeIcon icon={faBars} size="xl" />
    </button>
  </div>
);

export default MobileMenu;
