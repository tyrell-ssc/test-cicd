#!/bin/bash

echo "🔍 Checking for accidentally staged environment files..."

FORBIDDEN_PATTERNS=(
    ".env"
    ".env.local"
    ".env.staging"
    ".env.production"
)

FOUND_ISSUES=0

for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    if git diff --cached --name-only | grep -q "^${pattern}$"; then
        echo "❌ ERROR: Found staged file: ${pattern}"
        echo "   This file contains secrets and should NOT be committed!"
        FOUND_ISSUES=1
    fi
done

STAGED_ENV_FILES=$(git diff --cached --name-only | grep "\.env" | grep -v "\.env.*\.example$" || true)

if [ -n "$STAGED_ENV_FILES" ]; then
    echo "❌ ERROR: Found staged .env files without .example suffix:"
    echo "$STAGED_ENV_FILES"
    echo ""
    echo "Only .env.*.example files should be committed!"
    FOUND_ISSUES=1
fi

if [ $FOUND_ISSUES -eq 1 ]; then
    echo ""
    echo "🛑 Commit blocked - remove these files from staging:"
    echo "   git reset HEAD <filename>"
    echo ""
    exit 1
else
    echo "✅ No environment files found in staging area"
    exit 0
fi
