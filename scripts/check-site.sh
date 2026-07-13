#!/usr/bin/env bash

set -euo pipefail

if rg -q '\{\{% encrypt' content; then
  echo "protected content must not be committed to the public site" >&2
  exit 1
fi

if rg -q 'hugomods/(encrypt|pwa)|GoogleChrome/workbox|encrypt/assets|params\.encrypt' \
  hugo.toml go.mod go.sum .github layouts; then
  echo "unused encryption and offline modules must be removed" >&2
  exit 1
fi

site_url='https://hugo.1338888.xyz/hugo-blog/'
if ! rg -Fq "baseURL = '$site_url'" hugo.toml ||
  ! rg -Fq -- "--baseURL \"$site_url\"" .github/workflows/hugo.yml ||
  [[ -e static/CNAME ]] ||
  rg -q 'tu\.ltyuanfang\.cn' layouts; then
  echo "production URLs must use the confirmed site address" >&2
  exit 1
fi

if [[ -e themes/PaperMod || -e themes/dream || -e .gitmodules ]] ||
  [[ ! -f _vendor/modules.txt ]] ||
  ! rg -q '^# github\.com/nunocoracao/blowfish/v2 v2\.104\.0$' _vendor/modules.txt ||
  rg -q '^_vendor/$' .gitignore; then
  echo "only the active Blowfish theme may remain" >&2
  exit 1
fi

if ! rg -q 'HUGO_VERSION: 0\.163\.3' .github/workflows/hugo.yml ||
  ! rg -q 'github\.com/nunocoracao/blowfish/v2 v2\.104\.0' go.mod ||
  ! rg -q 'go-version-file: go\.mod' .github/workflows/hugo.yml ||
  ! rg -q 'scripts/check-site\.sh' .github/workflows/hugo.yml ||
  ! rg -q -- '--gc' .github/workflows/hugo.yml ||
  rg -q '@latest|hugo mod (init|get|tidy)' .github/workflows/hugo.yml ||
  rg -q 'languageCode|languageName|^[[:space:]]*nableCodeCopy' hugo.toml ||
  rg -q 'firebase|showViews = true|showLikes = true' hugo.toml ||
  ! rg -q '^buildFuture = false$' hugo.toml ||
  ! rg -q '^buildExpired = false$' hugo.toml; then
  echo "production configuration must remain reproducible" >&2
  exit 1
fi

if rg -q '^(tags|categories): \[null\]' content ||
  ! rg -q '^slug:' archetypes/default.md ||
  ! rg -q '^categories:' archetypes/default.md ||
  ! rg -q '^tags:' archetypes/default.md; then
  echo "content metadata must use the current front matter contract" >&2
  exit 1
fi

redundant_assets=(
  'static/images/posts/idea踩坑/image1.png'
  'static/images/posts/openGl配置/image1.png'
  'static/images/posts/java动态代理的学习/image2.png'
)
for asset in "${redundant_assets[@]}"; do
  if [[ -e "$asset" ]]; then
    echo "redundant image must be removed: $asset" >&2
    exit 1
  fi
done

avatar='assets/img/personal/avatar.webp'
if [[ ! -f "$avatar" ]] ||
  ! file "$avatar" | rg -q 'Web/P image' ||
  rg -q 'avatar\.png' hugo.toml config; then
  echo "avatar extension must match its WebP format" >&2
  exit 1
fi

if [[ ! -f vercel.json ]] ||
  ! jq -e '
    .framework == "hugo" and
    .build.env.HUGO_VERSION == "0.163.3" and
    .outputDirectory == "public" and
    (.buildCommand | contains("--baseURL https://$VERCEL_URL/"))
  ' vercel.json >/dev/null; then
  echo "Vercel must build Hugo into the public directory" >&2
  exit 1
fi

echo "site checks passed"
