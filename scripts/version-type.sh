#!/bin/bash

# Detect semantic version type (patch, minor, major)
# Usage: ./version-type.sh v1.2.3

if [ -z "$1" ]; then
  echo "Usage: $0 <version-tag>"
  exit 1
fi

VERSION=${1#v}  # Remove 'v' prefix
PREV_TAG=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "v0.0.0")
PREV_VERSION=${PREV_TAG#v}

# Parse current version
IFS='.' read -r -a current <<< "$VERSION"
# Parse previous version
IFS='.' read -r -a previous <<< "$PREV_VERSION"

# Determine version type
if [ "${previous[0]}" != "${current[0]}" ]; then
  echo "major"
elif [ "${previous[1]}" != "${current[1]}" ]; then
  echo "minor"
else
  echo "patch"
fi
