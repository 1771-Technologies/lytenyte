import { type JSX } from "react";
import { mergeProps } from "../hooks/use-slot/merge-props.js";
import { tw } from "./tw.js";

export interface ThemeToggleProps {
  readonly toggleTheme?: () => void;
  readonly themeStorageKey?: string;
}

export function ThemeToggle({
  toggleTheme: overrideToggle,
  ...props
}: JSX.IntrinsicElements["button"] & ThemeToggleProps) {
  const toggleTheme = overrideToggle ?? toggleThemeDefault;

  const finalProps = mergeProps(
    {
      onClick: () => {
        toggleTheme();
      },
    },
    props,
  );

  return (
    <button
      {...finalProps}
      className={tw(
        "relative flex cursor-pointer items-center gap-2 rounded-full border border-gray-400 bg-gray-300 px-1 py-1",
        finalProps.className,
      )}
    >
      <span className="sr-only">Toggle page theme</span>
      <span
        className={tw(
          "absolute left-0 size-6 rounded-full bg-gray-950 transition-transform",
          "dark:translate-x-[calc(100%)]",
        )}
      />
      <span className="iconify ph--sun-bold text-gray-50 transition-colors dark:text-gray-800" />
      <span className="iconify ph--moon-bold transition-colors dark:text-gray-50" />
    </button>
  );
}

const getTheme = () => {
  return (
    localStorage.getItem("theme") ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
};

const toggleThemeDefault = () => {
  const currentTheme = getTheme();

  document.documentElement.classList.add("ln-disable-transitions");
  setTimeout(() => {
    document.documentElement.classList.remove("ln-disable-transitions");
  });

  if (currentTheme === "dark") {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  } else {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }
};
