import { Menu, MenuHeader, MenuItem } from "@1771technologies/react-menu";
import { IconButton } from "./buttons/icon-button";
import { DownloadIcon } from "./icons/download-icon";
import { CsvIcon } from "./icons/svg-icon";

export interface ExportMenuProps {
  readonly ariaLabel?: string;
  readonly csvLabels?: {
    readonly dataOnly?: string;
    readonly withHeader?: string;
    readonly withGroupHeader?: string;
  };
}

export function ExportMenu({ ariaLabel = "csv export menu", csvLabels }: ExportMenuProps) {
  return (
    <Menu
      align="center"
      arrow
      menuButton={
        <IconButton aria-label={ariaLabel}>
          <DownloadIcon />
        </IconButton>
      }
    >
      <MenuHeader>CSV Export</MenuHeader>
      <MenuItem>
        <CsvIcon />
        {csvLabels?.dataOnly ?? "Data Only"}
      </MenuItem>
      <MenuItem>
        <CsvIcon />
        {csvLabels?.withHeader ?? "With Headers"}
      </MenuItem>
      <MenuItem>
        <CsvIcon />
        {csvLabels?.withGroupHeader ?? "With Group Headers"}
      </MenuItem>
    </Menu>
  );
}
