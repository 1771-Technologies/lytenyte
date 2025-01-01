import { Dialog } from "../../src";

export default function AlwaysOpen() {
  return (
    <div>
      <Dialog open onOpenChange={() => {}}>
        I will never close
      </Dialog>
    </div>
  );
}
