import { Command } from "commander";
import { applyPublishConfig } from "./publish-cmd";

export const applyPublishConfigCmd = new Command("apply-publish-config").action(async () => {
  applyPublishConfig(process.cwd() + "/package.json");
});
