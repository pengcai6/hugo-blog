#!/usr/bin/env bash

set -euo pipefail

has_pattern() {
  local pattern=$1
  shift
  grep -R -E -q -- "$pattern" "$@"
}

has_literal() {
  local text=$1
  shift
  grep -R -F -q -- "$text" "$@"
}

if has_pattern '\{\{% encrypt' content; then
  echo "protected content must not be committed to the public site" >&2
  exit 1
fi

if has_pattern 'hugomods/(encrypt|pwa)|GoogleChrome/workbox|encrypt/assets|params\.encrypt' \
  hugo.toml .github layouts; then
  echo "unused encryption and offline modules must be removed" >&2
  exit 1
fi

site_url='https://hugo.1338888.xyz/hugo-blog/'
if ! has_literal "baseURL = '$site_url'" hugo.toml ||
  ! has_literal "--baseURL \"$site_url\"" .github/workflows/hugo.yml ||
  [[ -e static/CNAME ]] ||
  has_pattern 'tu\.ltyuanfang\.cn' layouts; then
  echo "production URLs must use the confirmed site address" >&2
  exit 1
fi

if [[ -e themes/PaperMod || -e themes/dream || -e .gitmodules || -e _vendor ]] ||
  [[ ! -f themes/blowfish/theme.toml ]] ||
  [[ ! -f assets/css/compiled/main.css ]] ||
  [[ -e themes/blowfish/assets ]] ||
  [[ -e go.mod || -e go.sum ]] ||
  ! has_pattern '^theme = "blowfish"$' hugo.toml; then
  echo "only the active Blowfish theme may remain" >&2
  exit 1
fi

if ! has_pattern '^/lib/$' .gitignore ||
  git check-ignore -q assets/lib/zoom/style.css ||
  ! git ls-files --error-unmatch assets/lib/zoom/style.css >/dev/null 2>&1; then
  echo "theme libraries must not be hidden by generic ignore rules" >&2
  exit 1
fi

if ! has_pattern 'HUGO_VERSION: 0\.163\.3' .github/workflows/hugo.yml ||
  ! has_pattern 'scripts/check-site\.sh' .github/workflows/hugo.yml ||
  ! has_literal '--gc' .github/workflows/hugo.yml ||
  ! has_literal 'actions/checkout@v7' .github/workflows/hugo.yml ||
  ! has_literal 'actions/configure-pages@v6' .github/workflows/hugo.yml ||
  ! has_literal 'actions/upload-pages-artifact@v5' .github/workflows/hugo.yml ||
  ! has_literal 'actions/deploy-pages@v5' .github/workflows/hugo.yml ||
  has_pattern 'actions/setup-go|go-version-file|\[\[module\.imports\]\]' .github/workflows/hugo.yml hugo.toml ||
  has_pattern '@latest|hugo mod (init|get|tidy)' .github/workflows/hugo.yml ||
  has_pattern 'languageCode|languageName|^[[:space:]]*nableCodeCopy' hugo.toml ||
  has_pattern 'firebase|showViews = true|showLikes = true' hugo.toml ||
  ! has_pattern '^buildFuture = false$' hugo.toml ||
  ! has_pattern '^buildExpired = false$' hugo.toml; then
  echo "production configuration must remain reproducible" >&2
  exit 1
fi

if has_pattern '^(tags|categories): \[null\]' content ||
  ! has_pattern '^slug:' archetypes/default.md ||
  ! has_pattern '^categories:' archetypes/default.md ||
  ! has_pattern '^tags:' archetypes/default.md; then
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
  ! file "$avatar" | grep -E -q 'Web/P image' ||
  has_pattern 'avatar\.png' hugo.toml config; then
  echo "avatar extension must match its WebP format" >&2
  exit 1
fi

if [[ ! -f vercel.json ]] ||
  ! jq -e '
    .framework == "hugo" and
    .build.env.HUGO_VERSION == "0.163.3" and
    .outputDirectory == "public" and
    (.buildCommand | contains("--baseURL https://$VERCEL_URL/")) and
    (.buildCommand | contains("--gc") | not)
  ' vercel.json >/dev/null; then
  echo "Vercel must build Hugo into the public directory" >&2
  exit 1
fi

theme_head='themes/blowfish/layouts/partials/head.html'
if has_pattern 'resources\.Concat "(css|js)/main\.bundle' "$theme_head"; then
  echo "theme resource loading must remain compatible with Vercel" >&2
  exit 1
fi

echo "site checks passed"
