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
    document.body.classList.remove("light", "dark", "lng1771-term256", "lng1771-teal");
    document.body.classList.add(theme);
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
      <option value="lng1771-term256">Term</option>
      <option value="lng1771-teal">Teal</option>
    </select>
  );
}
