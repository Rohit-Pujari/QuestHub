"use client";
import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { logoutAPI } from "@/api/auth/authAPI";
import { useAlert } from "@/context/AlertContext";

const UserMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { setAlert } = useAlert();
  const router = useRouter(); // Initialize useRouter
  const handleLogout = async () => {
    try {
      const response = await logoutAPI();
      if (response.status === 200) {
        setIsMenuOpen(false);
        localStorage.removeItem("Auth");
        router.push("/login");
        setAlert({ type: "success", message: "Logged out successfully" });
        return;
      }
    }catch (error) {
      setAlert({ type: "error", message: "An error occurred" });
    }
  }

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Attach event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return isAuthenticated ? (
    <div className="relative">
      <button
        className="text-white focus:outline-none flex items-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="mr-2">{user.username}</span>
        <FontAwesomeIcon icon={faUser} size="lg" />
      </button>

      {isMenuOpen && (
        <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded shadow-lg">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
            </li>
            <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer flex items-center">
              <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
            </li>
            <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-600 cursor-pointer flex items-center">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  ) : (
    <div className="relative flex items-center gap-2">
      <button
        className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-6 rounded-md focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
        onClick={() => router.push("/signup")} // Navigate to sign-up page
      >
        Sign-up
      </button>
      <button
        className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-6 rounded-md focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
        onClick={() => router.push("/login")} // Navigate to login page
      >
        Login
      </button>
    </div>
  );
};

export default UserMenu;
