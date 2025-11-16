import { LineDivider } from "../line-divider.js";
import { HeroSquares } from "./hero-squares.js";

export function Frame() {
  return (
    <div role="presentation" aria-hidden>
      <div className="container mx-auto px-2">
        <LineDivider />
        <HeroSquares />
        <LineDivider />
        <div className="relative top-[-200px] h-[800px] md:px-8">
          <div className="relative h-full w-full rounded-2xl border border-gray-200/20 bg-transparent p-2 backdrop-blur-lg">
            <div className="bg-radial rounded-4xl absolute left-1/2 top-[2px] z-[-1] h-[30px] w-[calc(100%-36px)] -translate-x-1/2 from-white to-transparent" />
            <div className="h-full w-full rounded-2xl border border-gray-200 bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
