import { docs } from "@/.source";
import { loader } from "fumadocs-core/source";

export const source = loader({
  // it assigns a URL to your pages
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
