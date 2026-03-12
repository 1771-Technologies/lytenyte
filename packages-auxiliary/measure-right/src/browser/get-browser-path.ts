declare const process: { platform: "darwin" | "linux" | "win" };

export function getBrowserPath(path?: string) {
  if (path) return path;

  if (process.platform == "darwin") return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (process.platform == "linux") return "/usr/bin/google-chrome";
  else if (/^win/i.test(process.platform))
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
}
