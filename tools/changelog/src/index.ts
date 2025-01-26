import type { ChangelogFunctions } from "@changesets/types";

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine: async (changeset, type, opts) => {
    console.log(changeset);

    return "";
  },
  getDependencyReleaseLine: async () => "",
};

export default defaultChangelogFunctions;
