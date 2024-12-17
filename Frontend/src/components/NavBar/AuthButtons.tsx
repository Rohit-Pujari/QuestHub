import React from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAPI } from "../../utils/Auth/authAPI";
import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../store/store";

interface AuthButtonsProps {
}

const AuthButtons: React.FC<AuthButtonsProps> = () => {
  const { user,isAuthenticated } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle logout function
  const handleLogout = async () => {
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

  return (
    <>
      {isAuthenticated ? (
        <>
          <p className="font-semibold hover:text-indigo-400 transition duration-300">
            {user.username}
          </p>
          <Button
            type="button"
            onClick={handleLogout}
            style="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Button
            type="button"
            onClick={() => navigate("/sign-up")}
            style="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Sign up
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/login")}
            style="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Login
          </Button>
          </>
        )}
    </>
  );
};

export default AuthButtons;
