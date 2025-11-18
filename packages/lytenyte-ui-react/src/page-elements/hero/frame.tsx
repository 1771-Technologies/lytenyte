import { LineDivider } from "../line-divider.js";
import { HeroSquares } from "./hero-squares.js";
// import temp from "./temp.png";

export function Frame() {
  return (
    <>
      <div>
        <div className="container mx-auto px-2">
          <LineDivider />
          <HeroSquares />
          <LineDivider />
        </div>

        <div className="relative top-[-400px] h-[400px] w-full" role="presentation" aria-hidden>
          <div className="absolute h-[900px] w-full contain-strict">
            <div className="perspective-[6000px] container relative mx-auto h-full p-20">
              <div
                className="transform-3d mx-[-25%] h-full w-screen rounded-2xl border border-gray-200 bg-gray-200 lg:mx-auto lg:w-full"
                style={{
                  transform: "translate(3%)scale(0.98)rotateY(18deg)rotateX(30deg)rotateZ(-4deg)",
                }}
              >
                {/* <img src={temp} className="h-full w-full" /> */}
              </div>
              <div className="absolute bottom-20 right-8 h-[400px] w-[440px] rounded border border-gray-300 bg-gray-200"></div>
            </div>
          </div>
        </div>
        {/* <div className="to-page relative top-[-50px] z-10 h-[300px] w-full bg-gradient-to-b from-transparent to-30%"></div> */}
      </div>
    </>
  );
}
