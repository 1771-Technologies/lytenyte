import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { astroDoc } from "@1771technologies/lytenyte-doc";

export default defineConfig({
  integrations: [react(), astroDoc({})],
});
