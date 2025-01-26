const defaultChangelogFunctions = {
  getReleaseLine: async (changeset) => {
    if (changeset.commit) {
      return (
        `[Commit: ${changeset.commit.slice(0, 12)}](https://github.com/1771-Technologies/lytenyte/commit/${changeset.commit})\n` +
        changeset.summary
      );
    }
    return changeset.summary;
  },
  getDependencyReleaseLine: async () => {
    return "";
  },
};

module.exports = defaultChangelogFunctions;
