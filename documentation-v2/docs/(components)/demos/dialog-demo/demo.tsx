//#start
import { Dialog } from "@1771technologies/lytenyte-pro-experimental";
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
//#end

export default function TreeViewDemo() {
  return (
    <div style={{ height: "400px" }} className="ln-grid flex justify-center pt-8">
      <Dialog>
        <Dialog.Trigger data-ln-button="website" data-ln-size="md">
          Open Dialog
        </Dialog.Trigger>

        <Dialog.Container className="flex max-w-80 flex-col gap-3">
          <Dialog.Title className="text-lg font-bold">Dialog Title</Dialog.Title>
          <Dialog.Description>
            A description of the dialog content for accessibility reasons.
          </Dialog.Description>
          <div>You can include more dialog content. Dialogs should only be used for auxiliary actions.</div>

          <Dialog.Close data-ln-button="tertiary" data-ln-size="md">
            CloseDialog
          </Dialog.Close>
        </Dialog.Container>
      </Dialog>
    </div>
  );
}
