#!/usr/bin/env bash

set -eu

find ./dist/cjs -type f -name "*.js" -print0 \
  | while read -r -d '' file; do
      sed -e "s/require(\"\\(.*\\)\\.js\")/require(\"\\1.cjs\")/g" "$file" >"${file%%.js}.cjs"
      rm "$file"
    done
