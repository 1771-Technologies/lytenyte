import { page } from "@1771technologies/aio/browser";
import { dragPlaceholder } from "../drag-placeholder";

test("should render the correct placeholder", async () => {
  const el = dragPlaceholder(() => <div>Some content</div>);

  document.body.append(el);

  const placeholder = page.getByText("Some content");
  await expect.element(placeholder).toBeVisible();
});
