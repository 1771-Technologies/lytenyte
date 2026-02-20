//#start
import { Popover } from "@1771technologies/lytenyte-pro/components";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
//#end

export default function ComponentDemo() {
  return (
    <div style={{ height: "400px" }} className="ln-grid flex justify-center pt-8">
      <Popover>
        <Popover.Trigger data-ln-button="website" data-ln-size="md">
          Open Popover
        </Popover.Trigger>

        <Popover.Container className="flex max-w-80 flex-col gap-3 text-center">
          <Popover.Arrow />
          <Popover.Title className="text-lg font-bold">Popover Title</Popover.Title>
          <Popover.Description>
            Every popover requires a title and a description to ensure accessibility.
          </Popover.Description>
          <div>
            While you can include custom popover content, you should reserve popovers for auxiliary tasks
            only.
          </div>

          <Popover.Close
            data-ln-button="tertiary"
            data-ln-size="md"
            className="dark:hover:bg-ln-bg-ui-panel/80"
          >
            Close Popover
          </Popover.Close>
        </Popover.Container>
      </Popover>
    </div>
  );
}
