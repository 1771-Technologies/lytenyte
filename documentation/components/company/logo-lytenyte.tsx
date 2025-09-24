import Image from "next/image";
import DarkLogo from "./assets/dark-logo.png";
import LightLogo from "./assets/light-logo.png";

export function LogoLyteNyte() {
  return (
    <>
      <Image
        src={DarkLogo}
        alt="LyteNyte Grid logo for dark mode. Links back to the documentation home page."
        className="hidden w-[120px] dark:block"
        priority
      />
      <Image
        src={LightLogo}
        priority
        alt="LyteNyte Grid logo for light mode. Links back to the documentation home page."
        className="block w-[120px] dark:hidden"
      />
    </>
  );
}
