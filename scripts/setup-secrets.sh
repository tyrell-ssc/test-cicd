#!/bin/bash
set -e

echo "🔐 GitHub Secrets Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Prerequisites ───────────────────────────────────────────────────────────

if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "   macOS: brew install gh"
    echo "   Other: https://cli.github.com/manual/installation"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "❌ Not logged in to GitHub CLI. Run: gh auth login"
    exit 1
fi

REPO_OWNER=$(gh repo view --json owner --jq .owner.login 2>/dev/null || echo "")
REPO_NAME=$(gh repo view --json name --jq .name 2>/dev/null || basename "$(git rev-parse --show-toplevel 2>/dev/null)" || echo "")

if [ -z "$REPO_OWNER" ]; then
    read -p "GitHub username: " REPO_OWNER
fi

if [ -z "$REPO_NAME" ]; then
    echo "❌ Could not determine repository name"
    exit 1
fi

echo "✅ GitHub CLI ready — $REPO_OWNER/$REPO_NAME"
echo ""

# ── Choose environment ───────────────────────────────────────────────────────

echo "Which environment are you configuring?"
echo "  1) staging"
echo "  2) production"
echo ""
read -p "Choice [1/2]: " ENV_CHOICE
echo ""

case "$ENV_CHOICE" in
    1) ENV="staging" ;;
    2) ENV="production" ;;
    *) echo "❌ Invalid choice"; exit 1 ;;
esac

ENV_UPPER=$(echo "$ENV" | tr '[:lower:]' '[:upper:]')

# ── Resolve env file ─────────────────────────────────────────────────────────

DEFAULT_ENV_FILE=".env.$ENV"
read -p "Path to env file [default: $DEFAULT_ENV_FILE]: " ENV_FILE
ENV_FILE="${ENV_FILE:-$DEFAULT_ENV_FILE}"
echo ""

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ File not found: $ENV_FILE"
    echo ""
    echo "Copy the example and fill in your values:"
    echo "  cp .env.$ENV.example $ENV_FILE"
    exit 1
fi

echo "Reading secrets from: $ENV_FILE"
echo ""

# ── Keys to skip (derived/static in CI) ─────────────────────────────────────
# These are set explicitly in workflows or aren't secrets
SKIP_KEYS=(
    "VITE_APP_ENV"
    "EXPO_PUBLIC_APP_ENV"
    "NODE_ENV"
    "EXPO_PUBLIC_APP_SCHEME"
)

# ── Keys pushed without environment suffix (shared across environments) ──────
NO_SUFFIX_KEYS=(
    "SUPABASE_ACCESS_TOKEN"
)

# ── Helpers ──────────────────────────────────────────────────────────────────

SEEN_KEYS=""

was_seen() {
    [[ ":$SEEN_KEYS:" == *":$1:"* ]]
}

mark_seen() {
    SEEN_KEYS="$SEEN_KEYS:$1"
}

is_skip_key() {
    local k="$1"
    for skip in "${SKIP_KEYS[@]}"; do
        [[ "$k" == "$skip" ]] && return 0
    done
    return 1
}

is_no_suffix_key() {
    local k="$1"
    for ns in "${NO_SUFFIX_KEYS[@]}"; do
        [[ "$k" == "$ns" ]] && return 0
    done
    return 1
}

push_secret() {
    local name="$1"
    local value="$2"
    gh secret set "$name" -b"$value"
    echo "✅ $name"
}

# ── Parse env file and push secrets ─────────────────────────────────────────

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌍 Pushing $ENV_UPPER secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

while IFS= read -r line || [ -n "$line" ]; do
    # Skip blank lines and comments
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue

    # Parse key=value (value may contain '=')
    raw_key="${line%%=*}"
    value="${line#*=}"

    # Skip if key or value is empty
    [[ -z "$raw_key" || -z "$value" ]] && continue

    # Skip derived/static keys
    is_skip_key "$raw_key" && continue

    # Strip VITE_ and EXPO_PUBLIC_ prefixes for canonical base key
    base_key="${raw_key#VITE_}"
    base_key="${base_key#EXPO_PUBLIC_}"

    # Deduplicate — VITE_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_URL → one secret
    was_seen "$base_key" && continue
    mark_seen "$base_key"

    # Determine GitHub Secret name
    if is_no_suffix_key "$base_key"; then
        secret_name="$base_key"
    else
        secret_name="${base_key}_${ENV_UPPER}"
    fi

    push_secret "$secret_name" "$value"

done < "$ENV_FILE"

echo ""

# ── One-time infrastructure secrets (not in env files) ──────────────────────

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 One-time infrastructure secrets"
echo "   (skipped if already set)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

prompt_once() {
    local secret_name="$1"
    local prompt_text="$2"
    local url="$3"

    if gh secret list | grep -q "^$secret_name[[:space:]]"; then
        echo "✅ $secret_name already set — skipping"
    else
        echo "Get from: $url"
        read -sp "$prompt_text: " val
        echo ""
        if [ -z "$val" ]; then
            echo "⏭️  Skipped $secret_name"
        else
            push_secret "$secret_name" "$val"
        fi
    fi
    echo ""
}

prompt_once \
    "NETLIFY_AUTH_TOKEN" \
    "Netlify Personal Access Token" \
    "https://app.netlify.com/user/applications#personal-access-tokens"

prompt_once \
    "GH_PAT" \
    "GitHub PAT (needs: repo, secrets scopes)" \
    "https://github.com/settings/tokens"

# ── Done ─────────────────────────────────────────────────────────────────────

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ $ENV_UPPER secrets configured!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Repeat for the other environment if needed:   ./scripts/setup-secrets.sh"
echo "2. Push your code:  git push"
echo "3. Create a tag:    git tag v1.0.0 && git push --tags"
echo "4. GitHub Actions will build and deploy everything!"
echo ""
echo "View secrets: https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions"
