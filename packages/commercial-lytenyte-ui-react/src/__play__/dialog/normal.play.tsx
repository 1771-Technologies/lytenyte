import "@1771technologies/lytenyte-design/font.css";
import "@1771technologies/lytenyte-design/design.css";
import "@1771technologies/lytenyte-design/light.css";

import "../../design/dialog.css";
import { Dialog } from "../../headless/dialog/index.js";

export default function NormalPlay() {
  return (
    <div className="ln-dark">
      <Dialog.Root>
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        <Dialog.Container>
          <Dialog.Title>This is my dialog</Dialog.Title>
          <Dialog.Description>This is the dialog's description</Dialog.Description>
          Lee One two three
          <Dialog.Close>x</Dialog.Close>
        </Dialog.Container>
      </Dialog.Root>
    </div>
  );
}
