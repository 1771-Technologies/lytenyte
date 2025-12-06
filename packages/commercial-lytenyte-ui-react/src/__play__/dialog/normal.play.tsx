import "../../design/ui.css";

import { Dialog } from "../../headless/dialog/index.js";
import { Popover } from "../../headless/popover/index.js";

export default function NormalPlay() {
  return (
    <div className="ln-dark">
      <Dialog.Root>
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        <Dialog.Container>
          <Dialog.Title>This is my dialog</Dialog.Title>
          <Dialog.Description>This is the dialog's description</Dialog.Description>
          Lee One two three.
          <Dialog.Close>x</Dialog.Close>
        </Dialog.Container>
      </Dialog.Root>

      <div style={{ display: "flex", justifyContent: "center", padding: "300px" }}>
        <Popover.Root placement="bottom">
          <Popover.Trigger data-ln-button="primary" data-ln-icon>
            P
          </Popover.Trigger>
          <Popover.Container>
            <Popover.Arrow />
            <Popover.Title>This is the title</Popover.Title>
            <Popover.Description>This is the Desc</Popover.Description>
            This is my popover content.
          </Popover.Container>
        </Popover.Root>
      </div>
    </div>
  );
}
