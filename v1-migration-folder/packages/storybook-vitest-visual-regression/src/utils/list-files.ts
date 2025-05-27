import * as fs from "fs";
import * as path from "path";

export function listFiles(directoryPath: string): string[] {
  try {
    if (!fs.existsSync(directoryPath)) {
      console.error("Directory does not exist:", directoryPath);
      return [];
    }

    const stat = fs.statSync(directoryPath);
    if (!stat.isDirectory()) {
      console.error("Path is not a directory:", directoryPath);
      return [];
    }

    const files = fs.readdirSync(directoryPath);
    return files.map((file) => path.join(directoryPath, file));
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error reading directory:", err.message);
    } else {
      console.error("Unknown error occurred");
    }
    return [];
  }
}
