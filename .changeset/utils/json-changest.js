import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

function getGitInfo() {
  return { author: undefined, commitId: undefined };
}

export function createChangeset(type, description, packages) {
  // Create .changeset directory if it doesn't exist
  const changesetDir = path.join(process.cwd(), ".changeset");
  if (!fs.existsSync(changesetDir)) {
    fs.mkdirSync(changesetDir);
  }

  // Create or load the changes.json file
  const changesPath = path.join(changesetDir, "changes.json");
  let changes = [];

  if (fs.existsSync(changesPath)) {
    const content = fs.readFileSync(changesPath, "utf-8");
    changes = JSON.parse(content);
  }

  // Get git info
  const { author, commitId } = getGitInfo();

  // Create new change entry
  const change = {
    type,
    description,
    packages,
    date: new Date().toISOString(),
    author,
    commitId,
  };

  // Add the new change
  changes.push(change);

  // Write back to file
  fs.writeFileSync(changesPath, JSON.stringify(changes, null, 2));

  // Create empty changeset file to maintain compatibility
  const changesetId = uuidv4();
  const emptyChangesetPath = path.join(changesetDir, `${changesetId}.json`);
  fs.writeFileSync(emptyChangesetPath, JSON.stringify({ empty: true }));

  return changesetId;
}

// Helper to get all pending changes
export function getPendingChanges() {
  const changesPath = path.join(process.cwd(), ".changeset", "changes.json");
  if (!fs.existsSync(changesPath)) {
    return [];
  }
  const content = fs.readFileSync(changesPath, "utf-8");
  return JSON.parse(content);
}

// Helper to clear changes after version bump
export function clearChanges() {
  const changesPath = path.join(process.cwd(), ".changeset", "changes.json");
  if (fs.existsSync(changesPath)) {
    fs.writeFileSync(changesPath, "[]");
  }
}
