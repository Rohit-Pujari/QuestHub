import { useEffect, useState } from "react";

const usePreloadedAuthState = () => {
  const [preloadedAuthState, setPreloadedAuthState] = useState({
    user: { username: null ,id: null },
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuthState = localStorage.getItem("Auth");
      if (storedAuthState) {
        setPreloadedAuthState(JSON.parse(storedAuthState));
      }
    }
  }, []);

  return preloadedAuthState;
};

export default usePreloadedAuthState;
