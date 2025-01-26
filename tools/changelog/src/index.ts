import type { ChangelogFunctions } from "@changesets/types";

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine: (changeset, type, opts) => {},
  getDependencyReleaseLine: async () => "",
};

export default defaultChangelogFunctions;
