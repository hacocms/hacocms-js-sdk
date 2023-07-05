#!/usr/bin/env bash

find ./dist/cjs -type f -name "*.js" -print0 \
  | while read -r -d '' file; do
      sed -i '' "s/require(\"\\(.*\\)\\.js\")/require(\"\\1.cjs\")/g" "$file"
      mv "$file" "${file%%.js}.cjs"
    done
