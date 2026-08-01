#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "LootQuest requires Node.js 20 or newer."
  echo "Install it from https://nodejs.org and run this script again."
  exit 1
fi

node scripts/start.mjs
