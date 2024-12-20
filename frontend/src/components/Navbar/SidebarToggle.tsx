import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const SidebarToggle: React.FC<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <button
      className="text-white focus:outline-none"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faBars} size="lg" />
    </button>
  );
};

export default SidebarToggle;
