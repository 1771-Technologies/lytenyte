import { Button, DropdownMenu } from "@radix-ui/themes";
import { BlendingModeIcon } from "@radix-ui/react-icons";
import config from "playframe-config";

export interface IframeThemeDropdownProps {
  readonly theme: string;
  readonly onThemeChange: (theme: string) => void;
}

const FALLBACK_THEMES = [
  { name: "Light", value: "light", colorScheme: "light" as const },
  { name: "Dark", value: "dark", colorScheme: "dark" as const },
];

export function IframeThemeDropdown({ theme, onThemeChange }: IframeThemeDropdownProps) {
  const themes = config.themes.values.length > 0 ? config.themes.values : FALLBACK_THEMES;
  const disabled = themes.length <= 1;
  const current = themes.find((t) => t.value === theme) ?? themes[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={disabled}>
        <Button variant="soft" disabled={disabled} aria-label="Iframe theme menu trigger">
          <BlendingModeIcon />
          {current?.name}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="1" style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}>
        {themes.map((t) => (
          <DropdownMenu.Item key={t.value} onClick={() => onThemeChange(t.value)}>
            {t.name}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
