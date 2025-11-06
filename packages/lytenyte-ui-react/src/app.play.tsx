import "../index.css";
import { Button } from "./components/button.js";
import { Dialog } from "./components/dialog.js";
import { Navbar } from "./components/navbar.js";
import { ThemeToggle } from "./components/theme-toggle.js";
import { useTheme } from "@1771technologies/play-frame";

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
      <div className="container mx-auto flex flex-col gap-2 py-8">
        <div className="flex">
          <div className="h-8 w-24 border bg-gray-50"></div>
          <div className="h-8 w-24 border bg-gray-100"></div>
          <div className="h-8 w-24 border bg-gray-200"></div>
          <div className="h-8 w-24 border bg-gray-300"></div>
          <div className="h-8 w-24 border bg-gray-400"></div>
          <div className="h-8 w-24 border bg-gray-500"></div>
          <div className="h-8 w-24 border bg-gray-600"></div>
          <div className="h-8 w-24 border bg-gray-700"></div>
          <div className="h-8 w-24 border bg-gray-800"></div>
          <div className="h-8 w-24 border bg-gray-900"></div>
          <div className="h-8 w-24 border bg-gray-950"></div>
        </div>
        <div className="flex items-center gap-2">
          <Button kind="primary" size="large">
            Button
          </Button>
          <Button kind="primary" size="medium">
            Button
          </Button>
          <Button kind="primary" size="default">
            Button
          </Button>
          <Button kind="primary" size="icon">
            <span className="iconify ph--github-logo-fill"></span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button kind="secondary" size="large">
            Button
          </Button>
          <Button kind="secondary" size="medium">
            Button
          </Button>
          <Button kind="secondary" size="default">
            Button
          </Button>
          <Button kind="secondary" size="icon">
            <span className="iconify ph--github-logo"></span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button kind="tertiary" size="large">
            Button
          </Button>
          <Button kind="tertiary" size="medium">
            Button
          </Button>
          <Button kind="tertiary" size="default">
            Button
          </Button>
          <Button kind="tertiary" size="icon">
            <span className="iconify ph--github-logo-fill"></span>
          </Button>
        </div>
        <div>
          <Dialog.Root>
            <Dialog.Trigger>Open Dialog</Dialog.Trigger>
            <Dialog.Container>
              This is my dialog. It is nice.
              <Dialog.Close size="icon">
                <span className="iconify ph--x"></span>
              </Dialog.Close>
            </Dialog.Container>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
}

export default App;
