import { Dialog } from "../components/dialog.js";

export function Dialogs() {
  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        <Dialog.Container>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>This is the description of the dialog</Dialog.Description>
          <Dialog.Close size="icon">
            <span className="iconify ph--x"></span>
          </Dialog.Close>
        </Dialog.Container>
      </Dialog.Root>
    </div>
  );
}
