import { Menu, MenuItem } from "@1771technologies/react-menu";

export default function Home() {
  return (
    <Menu menuButton={<button type="button">Open</button>}>
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
    </Menu>
  );
}
