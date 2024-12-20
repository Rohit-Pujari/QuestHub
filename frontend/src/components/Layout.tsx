"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import AppProvider from "./AppProvider";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle the dark theme on button click or based on user's preference
  useEffect(() => {
    // Check user's preference from localStorage or default to light mode
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  // Apply the theme to the root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <AppProvider>
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900 dark:text-white">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          toggleTheme={toggleTheme}
          darkMode={isDarkMode}
        />
        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          {/* Main content */}
          <main
            className={`flex-1 p-4 ${isDarkMode ? "text-white" : "text-black"}`}
            onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
          >
            {children}
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

export default Layout;
