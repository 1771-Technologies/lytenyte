import { Button } from "../components/button.js";

export function Buttons() {
  return (
    <div className="flex flex-col gap-2">
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
        <Button kind="primary" size="default" disabled>
          Button
        </Button>
        <Button kind="primary" size="icon">
          <span className="sr-only">Icon button</span>
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
        <Button kind="secondary" size="default" disabled>
          Button
        </Button>
        <Button kind="secondary" size="icon">
          <span className="sr-only">Icon button</span>
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
        <Button kind="tertiary" size="default" disabled>
          Button
        </Button>
        <Button kind="tertiary" size="icon">
          <span className="sr-only">Icon button</span>
          <span className="iconify ph--github-logo-fill"></span>
        </Button>
      </div>
    </div>
  );
}
