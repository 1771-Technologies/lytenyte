//#start
import { Dialog } from "@1771technologies/lytenyte-pro/components";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
//#end

export default function ComponentDemo() {
  return (
    <div style={{ height: "400px" }} className="ln-grid flex justify-center pt-8">
      <Dialog>
        <Dialog.Trigger data-ln-button="website" data-ln-size="md">
          Open Dialog
        </Dialog.Trigger>

        <Dialog.Container className="flex max-w-80 flex-col gap-3">
          <Dialog.Title className="text-center text-lg font-bold">Dialog Title</Dialog.Title>
          <Dialog.Description className="text-center">
            Every dialog requires a title and a description to ensure accessibility.
          </Dialog.Description>
          <div className="text-center">
            While you can include custom dialog content, you should reserve dialogs for auxiliary tasks only.
          </div>

          <Dialog.Close
            data-ln-button="tertiary"
            className="dark:hover:bg-ln-bg-ui-panel/80"
            data-ln-size="md"
          >
            Close Dialog
          </Dialog.Close>
        </Dialog.Container>
      </Dialog>
    </div>
  );
}
