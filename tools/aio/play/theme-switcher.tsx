import { useCallback, useState, type ChangeEvent } from "react";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => {
    const theme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    if (theme !== null) {
      return theme;
    } else {
      return systemTheme;
    }
  });

  const updateTheme = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
    const theme = ev.target.value;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
    setTheme(theme);
  }, []);

  return (
    <select
      value={theme}
      onChange={(ev) => {
        updateTheme(ev);
      }}
    >
      <option value="dark">Dark</option>
      <option value="light">Light</option>
      <option value="lng-term256">Term</option>
      <option value="lng-teal">Teal</option>
    </select>
  );
}
