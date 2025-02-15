import { Menu, MenuHeader, MenuItem } from "@1771technologies/react-menu";
import { IconButton } from "./buttons/icon-button";
import { DownloadIcon } from "./icons/download-icon";
import { CsvIcon } from "./icons/svg-icon";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";

export interface ExportMenuProps<D> {
  readonly ariaLabel?: string;
  readonly csvLabels?: {
    readonly dataOnly?: string;
    readonly withHeader?: string;
    readonly withGroupHeader?: string;
  };
  readonly grid: StoreEnterpriseReact<D>;
}

export function ExportMenu<D>({
  ariaLabel = "csv export menu",
  csvLabels,
  grid,
}: ExportMenuProps<D>) {
  const api = grid.api;
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
      <MenuItem onClick={() => api.exportCsvFile().then(downloadFile)}>
        <CsvIcon />
        {csvLabels?.dataOnly ?? "Data Only"}
      </MenuItem>
      <MenuItem onClick={() => api.exportCsvFile({ includeHeader: true }).then(downloadFile)}>
        <CsvIcon />
        {csvLabels?.withHeader ?? "With Headers"}
      </MenuItem>
      <MenuItem
        onClick={() =>
          api.exportCsvFile({ includeGroupHeaders: true, includeHeader: true }).then(downloadFile)
        }
      >
        <CsvIcon />
        {csvLabels?.withGroupHeader ?? "With Group Headers"}
      </MenuItem>
    </Menu>
  );
}

function downloadFile(file: Blob) {
  const url = window.URL.createObjectURL(file);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "data.csv";
  document.body.append(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}
