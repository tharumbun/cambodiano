#!/usr/bin/env bash

# Go to your project root (where this script lives).
cd "$(dirname "$0")"

# Add all changes in the repo (including Bear exports).
git add -A

# Commit with timestamp (if there are changes).
TIMESTAMP=$(date +'%Y-%m-%d %H:%M:%S')
git commit -m "Auto-commit from Bear at $TIMESTAMP" || exit 0

# Push to GitHub
git push origin main
