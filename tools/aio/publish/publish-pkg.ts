import { Command } from "commander";
import { publishIfNew } from "./publish-cmd";

export const publishPkgCmd = new Command("publish-pkg").action(async () => {
  const res = await publishIfNew(process.cwd() + "/package.json");

  console.log(res);
});
