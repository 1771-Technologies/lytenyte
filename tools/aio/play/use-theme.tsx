import { useEffect } from "react";

export const useTheme = () => {
  useEffect(() => {
    // Set initial body class from localStorage
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.body.className = theme;
    }

    // Listen to localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        document.body.className = e.newValue || "";
      }
    };

    globalThis.addEventListener("storage", handleStorageChange);

    return () => {
      globalThis.removeEventListener("storage", handleStorageChange);
    };
  }, []);
};
