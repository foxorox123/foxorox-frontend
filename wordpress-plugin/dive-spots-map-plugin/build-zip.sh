#!/usr/bin/env bash
set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_SLUG="dive-spots-map-plugin"
ROOT_DIR="$(cd "$PLUGIN_DIR/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/dist"
OUTPUT_FILE="$OUTPUT_DIR/${PLUGIN_SLUG}.zip"

mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_FILE"

(
  cd "$ROOT_DIR"
  zip -r "$OUTPUT_FILE" "$PLUGIN_SLUG" \
    -x "$PLUGIN_SLUG/.git/*" \
    -x "$PLUGIN_SLUG/dist/*" \
    -x "$PLUGIN_SLUG/*.zip" \
    -x "$PLUGIN_SLUG/.DS_Store"
)

echo "ZIP ready: $OUTPUT_FILE"
