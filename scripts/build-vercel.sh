#!/usr/bin/env bash

set -euo pipefail

base_url='https://hugo-blog-cyan.vercel.app/'
if [[ ${VERCEL_ENV:-} == preview && -n ${VERCEL_URL:-} ]]; then
  base_url="https://${VERCEL_URL}/"
fi

exec hugo --minify --baseURL "$base_url"
