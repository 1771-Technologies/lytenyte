#!/bin/bash

# Exit on error
set -e

# Get version from package.json using bun
VERSION=$(bun -e "console.log(require('./grid-pro/lytenyte-pro/package.json').version)")

# Check if tag exists
if ! git ls-remote --tags origin | grep -q "v${VERSION}"; then
    echo "Creating tag v${VERSION}"
    git config --global user.email "github-actions[bot]@users.noreply.github.com"
    git config --global user.name "github-actions[bot]"
    git tag -a "v${VERSION}" -m "Release v${VERSION}"
    git push origin "v${VERSION}"
    echo "Successfully created and pushed tag v${VERSION}"
else
    echo "Tag v${VERSION} already exists, skipping tag creation"
    exit 0
fi