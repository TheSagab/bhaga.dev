#!/usr/bin/env bash
# Fingerprint the rendered site for UI comparison across a dependency upgrade.
# Normalises things that legitimately change (hashed asset names, generator meta,
# absolute timestamps) and hashes the rest.
#
#   scripts/ui-fingerprint.sh <output-file>
#
# PROTOTYPE — throwaway tooling for the dependency upgrade, not part of the site.
set -euo pipefail

out="${1:-/tmp/ui-fingerprint.txt}"
dist="${2:-dist}"

python3 - "$dist" "$out" <<'PY'
import hashlib, os, re, sys

dist, out = sys.argv[1], sys.argv[2]

def normalise(html: str) -> str:
    # Asset hashes and build ids change on every install; strip them.
    html = re.sub(r'/_astro/[A-Za-z0-9_.\-]+\.(css|js)', r'/_astro/ASSET.\1', html)
    html = re.sub(r'<meta name="generator"[^>]*>', '', html)
    html = re.sub(r'data-astro-cid-[a-z0-9]+', 'data-astro-cid-X', html)
    html = re.sub(r'data-astro-source-file="[^"]*"', '', html)
    html = re.sub(r'data-astro-source-loc="[^"]*"', '', html)
    # Class attribute values are the UI contract here; keep them verbatim.
    return html

rows = []
for root, _, files in os.walk(dist):
    for f in sorted(files):
        p = os.path.join(root, f)
        rel = os.path.relpath(p, dist)
        data = open(p, "rb").read()
        if f.endswith(".html"):
            h = hashlib.sha256(normalise(data.decode("utf-8", "replace")).encode()).hexdigest()[:16]
        else:
            h = hashlib.sha256(data).hexdigest()[:16]
        rows.append(f"{h}  {rel}  {len(data)}")

open(out, "w").write("\n".join(sorted(rows)) + "\n")
print(f"fingerprinted {len(rows)} files -> {out}")
PY
