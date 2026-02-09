#!/bin/bash
set -e

echo "🔐 GitHub Secrets Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will set up your GitHub repository secrets."
echo "You'll need:"
echo "  - Netlify personal access token"
echo "  - Expo access token"
echo "  - Supabase production credentials"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo ""
    echo "Install it with:"
    echo "  macOS: brew install gh"
    echo "  Other: https://cli.github.com/manual/installation"
    exit 1
fi

# Check if user is logged in
if ! gh auth status &> /dev/null; then
    echo "❌ You're not logged in to GitHub CLI"
    echo ""
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready"
echo ""

# Get repository info
REPO_NAME=$(basename $(git rev-parse --show-toplevel) 2>/dev/null || echo "")
if [ -z "$REPO_NAME" ]; then
    echo "❌ Not in a git repository"
    exit 1
fi

REPO_OWNER=$(gh repo view --json owner --jq .owner.login 2>/dev/null || echo "")
if [ -z "$REPO_OWNER" ]; then
    echo "⚠️  Remote repository not found. Make sure you've pushed to GitHub first."
    echo ""
    read -p "Enter your GitHub username: " REPO_OWNER
fi

echo "Repository: $REPO_OWNER/$REPO_NAME"
echo ""

# Netlify Token
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 Netlify Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Get your token from:"
echo "👉 https://app.netlify.com/user/applications#personal-access-tokens"
echo ""
read -sp "Netlify Personal Access Token: " NETLIFY_TOKEN
echo ""

if [ -z "$NETLIFY_TOKEN" ]; then
    echo "❌ Netlify token is required"
    exit 1
fi

gh secret set NETLIFY_AUTH_TOKEN -b"$NETLIFY_TOKEN"
echo "✅ NETLIFY_AUTH_TOKEN set"
echo ""

# Expo Token
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Expo Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Get your token from:"
echo "👉 https://expo.dev/settings/access-tokens"
echo ""
read -sp "Expo Access Token: " EXPO_TOKEN
echo ""

if [ -z "$EXPO_TOKEN" ]; then
    echo "❌ Expo token is required"
    exit 1
fi

gh secret set EXPO_TOKEN -b"$EXPO_TOKEN"
echo "✅ EXPO_TOKEN set"
echo ""

# Supabase Production Credentials
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️  Supabase Production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Get these from your Supabase project settings:"
echo "👉 https://supabase.com/dashboard/project/_/settings/api"
echo ""

read -p "Supabase URL: " SUPABASE_URL
read -sp "Supabase Publishable Key: " SUPABASE_PUBLISHABLE_KEY
echo ""
read -sp "Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY
echo ""
read -p "Database URL (postgres://...): " DATABASE_URL
echo ""

# Set production Supabase secrets
gh secret set SUPABASE_URL_PRODUCTION -b"$SUPABASE_URL"
gh secret set SUPABASE_PUBLISHABLE_KEY_PRODUCTION -b"$SUPABASE_PUBLISHABLE_KEY"
gh secret set SUPABASE_SERVICE_ROLE_KEY_PRODUCTION -b"$SUPABASE_SERVICE_ROLE_KEY"
gh secret set DATABASE_URL_PRODUCTION -b"$DATABASE_URL"

echo "✅ Production Supabase credentials set"
echo ""

# PostHog (optional)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 PostHog (Optional)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "PostHog API Key (or press Enter to skip): " POSTHOG_KEY

if [ ! -z "$POSTHOG_KEY" ]; then
    read -p "PostHog Host (default: https://app.posthog.com): " POSTHOG_HOST
    POSTHOG_HOST=${POSTHOG_HOST:-https://app.posthog.com}

    gh secret set POSTHOG_KEY_PRODUCTION -b"$POSTHOG_KEY"
    gh secret set POSTHOG_HOST_PRODUCTION -b"$POSTHOG_HOST"
    echo "✅ PostHog credentials set"
else
    echo "⏭️  Skipped PostHog"
fi
echo ""

# Sentry (optional)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🐛 Sentry (Optional)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Sentry DSN (or press Enter to skip): " SENTRY_DSN

if [ ! -z "$SENTRY_DSN" ]; then
    read -p "Sentry Organization: " SENTRY_ORG
    read -p "Sentry Project: " SENTRY_PROJECT
    read -sp "Sentry Auth Token: " SENTRY_AUTH_TOKEN
    echo ""

    gh secret set SENTRY_DSN_PRODUCTION -b"$SENTRY_DSN"
    gh secret set SENTRY_ORG_PRODUCTION -b"$SENTRY_ORG"
    gh secret set SENTRY_PROJECT_PRODUCTION -b"$SENTRY_PROJECT"
    gh secret set SENTRY_AUTH_TOKEN_PRODUCTION -b"$SENTRY_AUTH_TOKEN"
    echo "✅ Sentry credentials set"
else
    echo "⏭️  Skipped Sentry"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All secrets configured!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Push your code: git push"
echo "2. Create a tag: git tag v1.0.0 && git push --tags"
echo "3. Watch GitHub Actions deploy everything!"
echo ""
echo "View secrets at:"
echo "👉 https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions"
