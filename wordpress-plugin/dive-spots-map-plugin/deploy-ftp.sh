#!/usr/bin/env bash
set -euo pipefail

# Auto-deploy plugin files to a WordPress server via FTP/SFTP using lftp.
# Required env vars:
#   FTP_HOST            e.g. ftp.example.com
#   FTP_USER            e.g. wp_deploy
#   FTP_PASS            e.g. strong-password
#   FTP_REMOTE_PATH     e.g. /public_html/wp-content/plugins/dive-spots-map-plugin
# Optional env vars:
#   FTP_PROTOCOL        ftp (default), ftps, sftp
#   FTP_PORT            protocol port (auto if omitted)
#   FTP_LOCAL_PATH      local plugin dir (default: script dir)
#   FTP_IGNORE_CERT     true/false (default: true)
#
# Example:
#   FTP_HOST=ftp.example.com \
#   FTP_USER=wp_deploy \
#   FTP_PASS='secret' \
#   FTP_REMOTE_PATH='/public_html/wp-content/plugins/dive-spots-map-plugin' \
#   bash deploy-ftp.sh

for var in FTP_HOST FTP_USER FTP_PASS FTP_REMOTE_PATH; do
  if [[ -z "${!var:-}" ]]; then
    echo "Missing required env var: ${var}" >&2
    exit 1
  fi
done

if ! command -v lftp >/dev/null 2>&1; then
  echo "lftp is required. Install it first (e.g. apt install lftp / brew install lftp)." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOCAL_PATH="${FTP_LOCAL_PATH:-$SCRIPT_DIR}"
PROTOCOL="${FTP_PROTOCOL:-ftp}"
IGNORE_CERT="${FTP_IGNORE_CERT:-true}"

OPEN_TARGET="${PROTOCOL}://${FTP_HOST}"
if [[ -n "${FTP_PORT:-}" ]]; then
  OPEN_TARGET="${PROTOCOL}://${FTP_HOST}:${FTP_PORT}"
fi

LFTP_SSL="set ssl:verify-certificate ${IGNORE_CERT};"
if [[ "${IGNORE_CERT}" == "true" ]]; then
  LFTP_SSL="set ssl:verify-certificate no;"
fi

lftp -u "${FTP_USER}","${FTP_PASS}" "${OPEN_TARGET}" <<EOF
set net:max-retries 2;
set net:reconnect-interval-base 5;
set net:timeout 20;
${LFTP_SSL}
mkdir -p "${FTP_REMOTE_PATH}";
mirror -R --delete --verbose \
  --exclude-glob .git* \
  --exclude-glob dist \
  --exclude-glob '*.zip' \
  --exclude-glob '*.md' \
  "${LOCAL_PATH}" "${FTP_REMOTE_PATH}";
bye
EOF

echo "Deploy complete: ${LOCAL_PATH} -> ${OPEN_TARGET}${FTP_REMOTE_PATH}"
