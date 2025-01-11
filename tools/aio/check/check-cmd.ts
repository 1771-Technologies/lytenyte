import { Command } from "commander";
import { getClosestNpmPackage } from "../utils/get-closed-npm-package";

export const checkCmd = new Command("check")
  .description("Checks a package for any issues")
  .action(async () => {
    console.log("\nRunning Type Check\n");
    const typeCheckProc = Bun.spawn(["tsc"], { stdio: ["inherit", "inherit", "inherit"] });
    await typeCheckProc.exited;

    console.log("Types look good!");

    if (typeCheckProc.exitCode !== 0) process.exit(1);

    console.log("\nRunning Unit Tests\n");
    const testCheck = Bun.spawn(["aio", "test", "run", "--pass-with-no-tests"], {
      stdio: ["inherit", "inherit", "inherit"],
    });
    await testCheck.exited;

    if (testCheck.exitCode !== 0) process.exit(1);

    const nearestPkg = getClosestNpmPackage(process.cwd())?.replace("package.json", "");
    if (!nearestPkg) {
      console.error("Failed to determine the npm package for this project");
      process.exit(1);
    }

    const exists = await Bun.file(`${nearestPkg}/index.html`).exists();

    if (!exists) {
      console.log("\nNo index.html present, so assuming there are no playwright tests\n");
      return;
    }

    console.log("\nRunning Playwright tests - ensure web server is not running\n");
    const playwrightCheck = Bun.spawn(["aio", "playwright", "--pass-with-no-tests"], {
      stdio: ["inherit", "inherit", "inherit"],
    });
    await playwrightCheck.exited;

    if (playwrightCheck.exitCode !== 0) {
      console.error("Playwright tests failed.");
      process.exit(1);
    }
  });
