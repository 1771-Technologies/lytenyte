import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNytePro } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import {
  MenuArrow,
  MenuCheckboxItem,
  MenuCheckboxItemIndicator,
  MenuContainer,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
} from "../src/menu/menu-impl";

export default function Play() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(0, 2),
  });

  const grid = useLyteNytePro({
    gridId: "x",
    columns: columns,
    rowDataSource: ds,

    rowSelectionMode: "multiple",
    rowSelectionCheckbox: "normal",
    rowDragEnabled: true,

    columnMenuRenderer: () => {
      return (
        <MenuContainer>
          <MenuArrow />
          <MenuItem>Label 1</MenuItem>
          <MenuItem>Label 2</MenuItem>
          <MenuItem>Label 3</MenuItem>
          <MenuSeparator />
          <MenuItem>Label 4</MenuItem>
          <MenuItem>Label 5</MenuItem>
          <MenuItem disabled>Label 6</MenuItem>
          <MenuGroup>
            <MenuGroupLabel>Export</MenuGroupLabel>
            <MenuItem>CSX Export</MenuItem>
            <MenuItem>Excel Export</MenuItem>
            <MenuItem>PDF Export</MenuItem>
          </MenuGroup>
          <MenuSubmenu trigger={<MenuSubmenuTrigger>Trigger Me</MenuSubmenuTrigger>}>
            <MenuContainer>
              <MenuItem>Label 1</MenuItem>
              <MenuItem>Label 2</MenuItem>
              <MenuItem>Label 3</MenuItem>
            </MenuContainer>
          </MenuSubmenu>

          <MenuSeparator />

          <MenuCheckboxItem>
            <span>Minify</span>
            <MenuCheckboxItemIndicator />
          </MenuCheckboxItem>
          <MenuCheckboxItem>
            <span>Expand</span>
            <MenuCheckboxItemIndicator />
          </MenuCheckboxItem>

          <MenuRadioGroup>
            <MenuRadioItem value="alpha">
              <span>Alpha</span>
              <MenuRadioItemIndicator />
            </MenuRadioItem>
            <MenuRadioItem value="beta">
              <span>Beta</span>
              <MenuRadioItemIndicator />
            </MenuRadioItem>
            <MenuRadioItem value="theta">
              <span>Theta</span>
              <MenuRadioItemIndicator />
            </MenuRadioItem>
          </MenuRadioGroup>
        </MenuContainer>
      );
    },

    contextMenuRenderer: () => {
      return (
        <MenuContainer>
          <MenuArrow />
          <MenuItem>Label 1</MenuItem>
          <MenuItem>Label 2</MenuItem>
          <MenuItem>Label 3</MenuItem>
          <MenuSeparator />
          <MenuItem>Label 4</MenuItem>
          <MenuItem>Label 5</MenuItem>
          <MenuItem disabled>Label 6</MenuItem>
          <MenuGroup>
            <MenuGroupLabel>Export</MenuGroupLabel>
            <MenuItem>CSX Export</MenuItem>
            <MenuItem>Excel Export</MenuItem>
            <MenuItem>PDF Export</MenuItem>
          </MenuGroup>
          <MenuSubmenu trigger={<MenuSubmenuTrigger>Trigger Me</MenuSubmenuTrigger>}>
            <MenuContainer>
              <MenuItem>Label 1</MenuItem>
              <MenuItem>Label 2</MenuItem>
              <MenuItem>Label 3</MenuItem>
            </MenuContainer>
          </MenuSubmenu>

          <MenuSeparator />

          <MenuCheckboxItem>
            <span>Minify</span>
            <MenuCheckboxItemIndicator />
          </MenuCheckboxItem>
          <MenuCheckboxItem>
            <span>Expand</span>
            <MenuCheckboxItemIndicator />
          </MenuCheckboxItem>

          <MenuRadioGroup>
            <MenuRadioItem value="alpha">
              <span>Alpha</span>
              <MenuRadioItemIndicator />
            </MenuRadioItem>
            <MenuRadioItem value="beta">
              <span>Beta</span>
              <MenuRadioItemIndicator />
            </MenuRadioItem>
            <MenuRadioItem value="theta">
              <span>Theta</span>
              <MenuRadioItemIndicator />
            </MenuRadioItem>
          </MenuRadioGroup>
        </MenuContainer>
      );
    },

    columnBase: {
      resizable: true,
      movable: true,
      sortable: true,
      headerRenderer: ({ column, api }) => {
        return (
          <div
            style={{ width: "100%", height: "100%" }}
            onClick={(e) => api.columnMenuOpen(column, e.currentTarget)}
          >
            {column.headerName ?? column.id}
          </div>
        );
      },
    },
  });

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
      `}
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className={css`
          width: 100%;
        `}
      >
        <div
          className={css`
            padding: 20px;
            width: 200px;
          `}
        ></div>
      </div>
      <div
        className={css`
          flex: 1;
        `}
      >
        <LyteNyteGrid grid={grid} />
      </div>
    </div>
  );
}
