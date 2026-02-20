import { defineCollection } from "astro:content";
import { playloader } from "./playloader.js";
import { findNearestPackageJsonDir } from "./utilities/closest-package.js";

const play = defineCollection({
  loader: playloader({ base: findNearestPackageJsonDir(process.cwd())! }),
});

export const collections = { play };
