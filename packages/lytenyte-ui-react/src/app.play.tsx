import "../index.css";
import { Dialog } from "./components/dialog.js";
import { Navbar } from "./components/navbar.js";
import { ThemeToggle } from "./components/theme-toggle.js";
import { useTheme } from "@1771technologies/play-frame";

function App() {
  const theme = useTheme();

  const toggleTheme = () =>
    theme.theme === "light" ? theme.setTheme("dark") : theme.setTheme("light");
  return (
    <div>
      <Navbar
        floating
        end={
          <div>
            <ThemeToggle toggleTheme={toggleTheme} />
          </div>
        }
      />
      <div className="container mx-auto">
        <Dialog.Root>
          <Dialog.Trigger>Trigger</Dialog.Trigger>
          <Dialog.Container>This is my content. This is why my dialog works.</Dialog.Container>
        </Dialog.Root>
      </div>
    </div>
  );
}

export default App;
