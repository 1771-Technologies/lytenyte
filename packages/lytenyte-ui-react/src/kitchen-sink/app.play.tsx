import "../../index.css";
import { Navbar } from "../components/navbar.js";
import { ThemeToggle } from "../components/theme-toggle.js";
import { useTheme } from "@1771technologies/play-frame";
import { Buttons } from "./buttons.js";
import { Colors } from "./colors.js";
import { Dialogs } from "./dialogs.js";
import { Drawers } from "./drawers.js";
import { Menus } from "./menus.js";
import { Checkboxes } from "./checkboxes.js";

function App() {
  const theme = useTheme();

  const toggleTheme = () =>
    theme.theme === "light" ? theme.setTheme("dark") : theme.setTheme("light");
  return (
    <div className="bg-gray-50">
      <Navbar
        floating
        end={
          <div>
            <ThemeToggle toggleTheme={toggleTheme} />
          </div>
        }
      />
      <div className="container mx-auto flex flex-col gap-8 py-8">
        <Colors />
        <Buttons />
        <Dialogs />
        <Drawers />
        <Menus />
        <Checkboxes />
      </div>
    </div>
  );
}

export default App;
