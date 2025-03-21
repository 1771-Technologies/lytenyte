// import { MenuHeader, MenuItem } from "@1771technologies/react-menu";
// import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
// import { CsvIcon } from "@1771technologies/lytenyte-grid-community/icons";

// export interface CsvExportMenuItemsProps<D> {
//   readonly csvLabels?: {
//     readonly dataOnly?: string;
//     readonly withHeader?: string;
//     readonly withGroupHeader?: string;
//   };
//   readonly grid: StoreEnterpriseReact<D>;
// }

// export function CsvExportMenuItems<D>({ csvLabels, grid }: CsvExportMenuItemsProps<D>) {
//   const api = grid.api;
//   return (
//     <>
//       <MenuHeader>CSV Export</MenuHeader>
//       <MenuItem onClick={() => api.exportCsvFile().then(downloadFile)}>
//         <CsvIcon />
//         {csvLabels?.dataOnly ?? "Data Only"}
//       </MenuItem>
//       <MenuItem onClick={() => api.exportCsvFile({ includeHeader: true }).then(downloadFile)}>
//         <CsvIcon />
//         {csvLabels?.withHeader ?? "With Headers"}
//       </MenuItem>
//       <MenuItem
//         onClick={() =>
//           api.exportCsvFile({ includeGroupHeaders: true, includeHeader: true }).then(downloadFile)
//         }
//       >
//         <CsvIcon />
//         {csvLabels?.withGroupHeader ?? "With Group Headers"}
//       </MenuItem>
//     </>
//   );
// }

// function downloadFile(file: Blob) {
//   const url = window.URL.createObjectURL(file);
//   const a = document.createElement("a");
//   a.style.display = "none";
//   a.href = url;
//   a.download = "data.csv";
//   document.body.append(a);
//   a.click();
//   window.URL.revokeObjectURL(url);
//   a.remove();
// }
