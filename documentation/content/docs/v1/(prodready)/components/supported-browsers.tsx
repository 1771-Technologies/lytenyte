import Safari from "./browser-images/safari.svg";
import Chrome from "./browser-images/chrome.svg";
import Edge from "./browser-images/edge.svg";
import Firefox from "./browser-images/firefox.svg";
import Image from "next/image";

export function SupportedBrowsers() {
  return (
    <div className="grid grid-cols-[24px_140px_1fr] gap-4">
      <div className="col-span-2 text-lg font-bold">Browser</div>
      <div className="text-lg font-bold">Supported Versions</div>
      <div className="col-span-full border-b border-b-gray-500" />
      <Image src={Chrome} alt="Chrome logo" style={{ margin: 0 }} className="m-0 h-7 w-7" />{" "}
      <div>Chrome</div> <div>Latest two major versions</div>
      <Image
        src={Edge}
        alt="Microsoft Edge logo"
        style={{ margin: 0 }}
        className="m-0 h-7 w-7"
      />{" "}
      <div>Microsoft Edge</div> <div>Latest two major versions</div>
      <Image src={Safari} alt="Safari logo" style={{ margin: 0 }} className="m-0 h-7 w-7" />{" "}
      <div>Safari</div> <div>Latest two major versions</div>
      <Image src={Firefox} alt="Firefox Logo" style={{ margin: 0 }} className="m-0 h-7 w-7" />{" "}
      <div>Firefox</div> <div>Latest two major versions</div>
    </div>
  );
}

export function MobileBrowsers() {
  return (
    <div className="grid grid-cols-[24px_140px_1fr] gap-4">
      <div className="col-span-2 text-lg font-bold">Browser</div>
      <div className="text-lg font-bold">Supported Versions</div>
      <div className="col-span-full border-b border-b-gray-500" />
      <Image src={Chrome} alt="Chrome logo" style={{ margin: 0 }} className="m-0 h-7 w-7" />{" "}
      <div>Chrome</div> <div>Latest two major versions</div>
      <Image src={Safari} alt="Safari Logo" style={{ margin: 0 }} className="m-0 h-7 w-7" />{" "}
      <div>Safari iOS</div> <div>Latest two major versions</div>
    </div>
  );
}
