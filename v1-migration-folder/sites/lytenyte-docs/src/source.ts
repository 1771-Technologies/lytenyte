import { guides, changelog, reference } from "../.source";

import { loader } from "fumadocs-core/source";

export const guidesCollection = loader({
  baseUrl: "/",
  source: guides.toFumadocsSource(),
});

export const changelogCollection = loader({
  baseUrl: "/changelog",
  source: changelog.toFumadocsSource(),
});

export const referenceCollection = loader({
  baseUrl: "/reference",
  source: reference.toFumadocsSource(),
});
