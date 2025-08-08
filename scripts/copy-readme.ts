import fs from "fs/promises";

const readme = await fs.readFile("./README.md", "utf-8");

console.log(readme);
