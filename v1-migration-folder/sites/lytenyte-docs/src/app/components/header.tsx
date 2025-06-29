import { SkipToMainContent } from "./skip-to-main-content";
import { ThemeToggle } from "./theme-toggle";
import { Logo1771 } from "./ui/logos/1771-logo";

export function Header() {
  return (
    <>
      <SkipToMainContent />

      <header className="flex w-full flex-1 items-center">
        <div>
          <Logo1771 width={200} />
        </div>
        <div className="flex flex-1 items-center justify-center">Search goes here</div>
        <ThemeToggle />
      </header>
    </>
  );
}
