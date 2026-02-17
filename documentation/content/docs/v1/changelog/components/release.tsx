import Image from "next/image";
import ReleaseImage from "./release.png";
import V1 from "./v1-image.png";

export function Release() {
  return (
    <Image
      src={ReleaseImage}
      alt="LyteNyte Grid. Image of the grid with a drag hover icon representing row drag"
    />
  );
}

export function V1Image() {
  return (
    <Image src={V1} alt="LyteNyte Grid. V1 release image representing a latency time dashboard." />
  );
}
