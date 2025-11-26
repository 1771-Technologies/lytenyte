import { Drawer } from "../components/drawer.js";

export function Drawers() {
  return (
    <div className="flex gap-2">
      <Drawer.Root>
        <Drawer.Trigger>Open Left</Drawer.Trigger>
        <Drawer.Container className="w-[280px]" side="start">
          Left Container
        </Drawer.Container>
      </Drawer.Root>
      <Drawer.Root>
        <Drawer.Trigger>Open Right</Drawer.Trigger>
        <Drawer.Container className="w-[280px]" side="end">
          Right Container
        </Drawer.Container>
      </Drawer.Root>
      <Drawer.Root>
        <Drawer.Trigger>Open Top</Drawer.Trigger>
        <Drawer.Container className="h-[300px]" side="top">
          Top Container
        </Drawer.Container>
      </Drawer.Root>
      <Drawer.Root>
        <Drawer.Trigger>Open Bottom</Drawer.Trigger>
        <Drawer.Container className="h-[300px]" side="bottom">
          Bottom Container
        </Drawer.Container>
      </Drawer.Root>
    </div>
  );
}
