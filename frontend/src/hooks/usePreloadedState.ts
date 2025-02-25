import { useEffect, useState } from "react";

const usePreloadedState = () => {
  const [preloadedState, setPreloadedState] = useState({
    user: {
      id: null,
      username: null,
      profilePicture: null,
    },
    token: null,
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedState = localStorage.getItem("Auth");
      if (storedState) {
        setPreloadedState(JSON.parse(storedState));
      }
    }
  }, []);
  return preloadedState;
};

export default usePreloadedState;
