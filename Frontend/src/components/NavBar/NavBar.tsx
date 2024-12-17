import React, { useState } from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { logoutAPI } from "../../utils/Auth/authAPI";
import { logout } from "../../features/auth/authSlice";

interface NavLink {
  name: string;
  path: string;
}

interface INavBar {
  navLinks: NavLink[];
}

const NavBar: React.FC<INavBar> = ({ navLinks }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user,isAuthenticated } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  // this function is used to handle logout feature
  const dispatch = useDispatch();
  const handlelogout = async () => {
    try {
      const response = await logoutAPI();
      if (response.status === 200) {
        dispatch(logout());
        alert("Logged out successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <Logo />

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center space-x-6">
        <NavLinks
          navLinks={navLinks}
          style="flex space-x-6 text-sm font-medium hover:text-indigo-400 transition duration-300"
        />
      </div>
      <div className="hidden md:flex gap-2">
        {/* if user is logged in */}
        {user?.username && (
          <>
            <p className="font-semibold hover:text-indigo-400 transition duration-300">
              {user.username}
            </p>
            <Button
              type="button"
              onClick={() => {
                handlelogout();
              }}
              style="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Log out
            </Button>
          </>
        )}
        {/* if user is not logged in */}
        {!isAuthenticated && (
          <>
            <Button
              type="button"
              onClick={() => {
                navigate("/sign-up");
              }}
              style="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Sign up
            </Button>
            <Button
              type="button"
              onClick={() => {
                navigate("/login");
              }}
              style="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Login
            </Button>
          </>
        )}
      </div>
      {/* Mobile Menu Button */}
      <MobileMenu toggleMobileMenu={toggleMobileMenu} />

      {/* Mobile Nav Links */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 p-2 w-full h-[35vh] bg-gray-800 z-50 shadow-lg md:hidden">
          <NavLinks
            navLinks={navLinks}
            onClick={() => setMobileMenuOpen(false)}
            style="flex flex-col items-start p-4 space-y-4 text-sm font-medium hover:text-indigo-400 transition duration-300"
          />
          <div className="flex gap-2 items-start">
            {!isAuthenticated && (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/sign-up");
                  }}
                  style="bg-indigo-500 text-white p-2 rounded-md w-fit mt-4 text-center hover:bg-indigo-600 transition duration-300"
                >
                  Sign up
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  style="bg-indigo-500 text-white p-2 rounded-md w-fit mt-4 text-center hover:bg-indigo-600 transition duration-300"
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;