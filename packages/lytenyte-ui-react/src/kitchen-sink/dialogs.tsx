import { Dialog } from "../components/dialog.js";

export function Dialogs() {
  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        <Dialog.Container>
          This is my dialog. It is nice.
          <Dialog.Close size="icon">
            <span className="iconify ph--x"></span>
          </Dialog.Close>
        </Dialog.Container>
      </Dialog.Root>
    </div>
  );
}
