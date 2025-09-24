import Image from "next/image";
import ProSrc from "./assets/pro.png";
import { cn } from "../cn";

export function ProTag({ small }: { small?: boolean }) {
  return (
    <Image
      className={cn("my-0 ml-1 inline-flex w-8", small && "w-6")}
      style={{ margin: "0px" }}
      src={ProSrc}
      alt="Tag indicating the feature is only available for LyteNyte PRO"
    />
  );
}
