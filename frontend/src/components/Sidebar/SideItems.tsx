import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faCog } from "@fortawesome/free-solid-svg-icons";

const SideItems: React.FC<{
  isSidebarOpen: boolean;
  onNavigate: () => void;
}> = ({ isSidebarOpen, onNavigate }) => {
  const items = [
    { icon: faHome, label: "Home", path: "/" },
    { icon: faUser, label: "Profile", path: "/profile" },
    { icon: faCog, label: "Settings", path: "/settings" },
  ];

  return (
    <ul className="space-y-4 mt-4">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700"
          onClick={onNavigate}
        >
          <FontAwesomeIcon icon={item.icon} size="lg" />
          {isSidebarOpen && <span className="ml-2">{item.label}</span>}
        </li>
      ))}
    </ul>
  );
};

export default SideItems;
