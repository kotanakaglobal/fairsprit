#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/release"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_FILE="$OUTPUT_DIR/fairsprit-full-$TIMESTAMP.tar.gz"

mkdir -p "$OUTPUT_DIR"

tar \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  -czf "$OUTPUT_FILE" \
  -C "$ROOT_DIR" .

echo "Created: $OUTPUT_FILE"
