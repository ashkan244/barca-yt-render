#!/usr/bin/env bash
# CI helper: make ffmpeg + ffprobe available on an Ubuntu runner without hanging on a slow apt mirror.
# Order: already installed → cached .deb files (~/apt-debs, filled by an earlier successful run) →
# apt with timeouts (then saves the .debs for the cache) → static build via the static-ffmpeg package.
set -u
ok() { command -v ffmpeg >/dev/null && command -v ffprobe >/dev/null && ffmpeg -version | head -1; }
ok && exit 0
DEBS="$HOME/apt-debs"
if compgen -G "$DEBS/*.deb" >/dev/null; then
  sudo dpkg -i "$DEBS"/*.deb >/dev/null 2>&1 || sudo apt-get install -y -q --no-download -f >/dev/null 2>&1
  ok && exit 0
fi
for i in 1 2; do
  if timeout 120 sudo apt-get update -q -o Acquire::Retries=2 && timeout 240 sudo apt-get install -y -q --download-only ffmpeg \
     && sudo apt-get install -y -q --no-download ffmpeg; then
    mkdir -p "$DEBS" && cp /var/cache/apt/archives/*.deb "$DEBS"/ 2>/dev/null
    ok && exit 0
  fi
  echo "apt attempt $i failed or timed out" >&2
done
echo "Falling back to a static ffmpeg build" >&2
pip install -q static-ffmpeg==3.0
dir=$(python -c "import os, static_ffmpeg.run as r; print(os.path.dirname(r.get_or_fetch_platform_executables_else_raise()[0]))")
echo "$dir" >> "${GITHUB_PATH:-/dev/null}"; export PATH="$dir:$PATH"
ok
