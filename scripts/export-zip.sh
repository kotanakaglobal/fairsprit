#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/release"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_FILE="$OUTPUT_DIR/fairsprit-$TIMESTAMP.zip"

mkdir -p "$OUTPUT_DIR"

(
  cd "$ROOT_DIR"
  zip -r "$OUTPUT_FILE" . \
    -x '.git/*' 'node_modules/*' '.next/*' 'release/*'
)

echo "Created: $OUTPUT_FILE"
