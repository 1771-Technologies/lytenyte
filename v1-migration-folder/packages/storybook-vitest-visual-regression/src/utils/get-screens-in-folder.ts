import * as fs from "fs";
import * as path from "path";

export function getScreensInFolder(directoryPath: string): { filename: string; base64: string }[] {
  try {
    if (!fs.existsSync(directoryPath)) {
      return [];
    }

    const stat = fs.statSync(directoryPath);
    if (!stat.isDirectory()) {
      return [];
    }

    const files = fs.readdirSync(directoryPath);
    const pngFiles = files.filter((file) => path.extname(file).toLowerCase() === ".png");

    return pngFiles.map((file) => {
      const fullPath = path.join(directoryPath, file);
      const fileBuffer = fs.readFileSync(fullPath);
      const base64 = fileBuffer.toString("base64");
      return {
        filename: file,
        base64: base64,
      };
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error processing PNG files:", err.message);
    } else {
      console.error("Unknown error occurred");
    }
    return [];
  }
}
