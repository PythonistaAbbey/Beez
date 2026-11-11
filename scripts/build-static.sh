#!/usr/bin/env bash
# Builds a static preview of the prototype into ./out (no server needed).
# The mock API routes are set aside during the build; the browser produces
# the same synthetic responses instead (see src/lib/demoFetch.ts).
set -euo pipefail
cd "$(dirname "$0")/.."
stash=".api-stash"
rm -rf "$stash" out
mv src/app/api "$stash"
trap 'mv "$stash" src/app/api' EXIT
STATIC_EXPORT=1 npx next build
# Root redirect to the English site, and a noindex hint for crawlers.
cat > out/index.html <<'HTML'
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0; url=en/"><title>Beez concept prototype</title></head><body><a href="en/">Open the prototype</a></body></html>
HTML
printf 'User-agent: *\nDisallow: /\n' > out/robots.txt
echo "Static preview ready in ./out"
