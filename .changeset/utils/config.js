import { getPendingChanges, clearChanges } from "./json-changeset";

const jsonFormat = {
  getReleaseLine: (changeset, _) => {
    const [firstLine, ...futureLines] = changeset.summary.split("\n").map((l) => l.trimRight());

    return {
      releaseNotes: `${firstLine}\n${futureLines.map((l) => `${l}`).join("\n")}`,
      changesetIds: changeset.id,
    };
  },

  getDependencyReleaseLine: (_, dependenciesUpdated) => {
    if (dependenciesUpdated.length === 0) return "";

    const changes = getPendingChanges();
    const dependencyChanges = changes.filter((change) =>
      change.packages.some((pkg) => dependenciesUpdated.includes(pkg)),
    );

    return {
      releaseNotes: dependencyChanges
        .map((change) => `- ${change.description} (${change.type})`)
        .join("\n"),
      changesetIds: [],
    };
  },

  updateChangelog: (releases, changelog) => {
    const changes = getPendingChanges();

    // Convert changes to JSON format
    const jsonChangelog = {
      version: releases.newVersion,
      date: new Date().toISOString(),
      changes: changes.map((change) => ({
        type: change.type,
        description: change.description,
        packages: change.packages,
        author: change.author,
        commitId: change.commitId,
      })),
    };

    // Write to CHANGELOG.json
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const changelogPath = path.join(process.cwd(), "CHANGELOG.json");

    let existingChangelog = [];
    if (fs.existsSync(changelogPath)) {
      existingChangelog = JSON.parse(fs.readFileSync(changelogPath, "utf-8"));
    }

    existingChangelog.unshift(jsonChangelog);
    fs.writeFileSync(changelogPath, JSON.stringify(existingChangelog, null, 2));

    // Clear pending changes
    clearChanges();

    return changelog;
  },
};

export default jsonFormat;
