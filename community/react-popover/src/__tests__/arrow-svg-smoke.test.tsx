import { render } from "@1771technologies/aio/vitest";
import { DownArrow, LeftArrow, RightArrow, UpArrow } from "../arrow-svgs";

test("Arrow svg smoke tests", () => {
  render(<UpArrow />);
  render(<DownArrow />);
  render(<LeftArrow />);
  render(<RightArrow />);
});
