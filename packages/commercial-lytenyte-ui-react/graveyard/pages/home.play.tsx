import "../../index.css";
import { Button } from "../components/button.js";
import { useTheme } from "@1771technologies/play-frame";
import { Logo1771Tech } from "../components/logos/1771tech.js";
import { Navbar } from "../components/navbar.js";
import { ThemeToggle } from "../components/theme-toggle.js";
import { Frame } from "../page-elements/hero/frame.js";
import { PageDivider } from "../page-elements/page-divider.js";

export default function Home() {
  const theme = useTheme();

  const toggleTheme = () =>
    theme.theme === "light" ? theme.setTheme("dark") : theme.setTheme("light");
  return (
    <>
      <Navbar
        floating
        transparent
        large
        classNameInner="border-transparent bg-gray-200/50 px-4"
        classNameContainer="px-[50px]"
        start={<Logo1771Tech height={24} />}
        end={
          <div className="flex items-center gap-3">
            <Button kind="tertiary" size="icon" className="">
              <span className="sr-only">Github link</span>
              <span className="iconify ph--github-logo-duotone size-4"></span>
            </Button>
            <ThemeToggle toggleTheme={toggleTheme} />
          </div>
        }
      />
      <PageDivider />

      <main>
        <div className="mt-8 h-fit w-full px-2">
          <Frame />
        </div>
        <div className="w-full"></div>
      </main>
    </>
  );
}
