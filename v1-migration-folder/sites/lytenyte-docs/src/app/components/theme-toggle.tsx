"use client";

import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { IconButton } from "./ui/icon-button";

export function ThemeToggle() {
  return (
    <IconButton
      onClick={() => {
        const theme = localStorage.getItem("theme");

        let finalTheme = "dark";

        if (theme === "system") {
          const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
          if (isDarkMode) finalTheme = "light";
          else finalTheme = "dark";
        } else if (theme === "dark") {
          finalTheme = "light";
        } else {
          finalTheme = "dark";
        }

        document.documentElement.classList.add("no-transitions");
        setTimeout(() => {
          document.documentElement.classList.remove("no-transitions");
        });
        document.documentElement.setAttribute("data-theme", finalTheme);
        document.documentElement.style.colorScheme = finalTheme;
        localStorage.setItem("theme", finalTheme);
      }}
    >
      <SunIcon className="in-data-[theme=dark]:hidden" />
      <MoonIcon className="in-data-[theme=light]:hidden" />
      <span className="sr-only">Toggle theme</span>
    </IconButton>
  );
}
