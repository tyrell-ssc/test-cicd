#!/bin/bash

# Environment Validation Script
# Checks if all required environment variables are set

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}🔍 Environment Validation${NC}"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo ""
    echo "Run one of these commands to set up your environment:"
    echo "  bun setup           # Set up local development"
    echo "  bun switch:env      # Switch to staging/production"
    echo ""
    exit 1
fi

# Load .env file
set -a
source "$PROJECT_ROOT/.env"
set +a

# Detect environment
CURRENT_ENV="${APP_ENV:-unknown}"
echo -e "Environment: ${GREEN}${CURRENT_ENV}${NC}"
echo ""

# Required variables for all environments
REQUIRED_VARS=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_PUBLISHABLE_KEY"
    "EXPO_PUBLIC_SUPABASE_URL"
    "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
)

# Additional required vars for non-local environments
if [ "$CURRENT_ENV" != "local" ] && [ "$CURRENT_ENV" != "development" ]; then
    REQUIRED_VARS+=(
        "SUPABASE_SECRET_KEY"
        "DATABASE_URL"
    )
fi

# Analytics variables (if analytics feature enabled)
ANALYTICS_VARS=(
    "VITE_POSTHOG_KEY"
    "EXPO_PUBLIC_POSTHOG_KEY"
)

# Error tracking variables (if error-tracking feature enabled)
ERROR_TRACKING_VARS=(
    "VITE_SENTRY_DSN"
    "EXPO_PUBLIC_SENTRY_DSN"
)

# Monetization variables (if revenue-cat feature enabled)
MONETIZATION_VARS=(
    "VITE_REVENUECAT_API_KEY"
    "EXPO_PUBLIC_REVENUECAT_API_KEY"
)

MISSING_VARS=()
PLACEHOLDER_VARS=()

# Function to check if a variable is set and not a placeholder
check_var() {
    local var_name=$1
    local var_value="${!var_name}"

    if [ -z "$var_value" ]; then
        MISSING_VARS+=("$var_name")
        return 1
    fi

    # Check for common placeholder patterns
    if [[ "$var_value" =~ (your-|xxx|here|placeholder|changeme) ]]; then
        PLACEHOLDER_VARS+=("$var_name")
        return 1
    fi

    return 0
}

# Check required variables
echo "Checking required variables..."
for var in "${REQUIRED_VARS[@]}"; do
    if check_var "$var"; then
        echo -e "  ${GREEN}✓${NC} $var"
    elif [[ " ${MISSING_VARS[@]} " =~ " ${var} " ]]; then
        echo -e "  ${RED}✗${NC} $var (missing)"
    else
        echo -e "  ${YELLOW}⚠${NC} $var (placeholder value)"
    fi
done

echo ""

# Check analytics variables (optional but recommended)
echo "Checking analytics variables..."
for var in "${ANALYTICS_VARS[@]}"; do
    if check_var "$var"; then
        echo -e "  ${GREEN}✓${NC} $var"
    else
        echo -e "  ${YELLOW}⚠${NC} $var (not configured)"
    fi
done
echo ""

# Check error tracking variables (optional but recommended)
echo "Checking error tracking variables..."
for var in "${ERROR_TRACKING_VARS[@]}"; do
    if check_var "$var"; then
        echo -e "  ${GREEN}✓${NC} $var"
    else
        echo -e "  ${YELLOW}⚠${NC} $var (not configured)"
    fi
done
echo ""

# Check monetization variables (optional)
echo "Checking monetization variables..."
for var in "${MONETIZATION_VARS[@]}"; do
    if check_var "$var"; then
        echo -e "  ${GREEN}✓${NC} $var"
    else
        echo -e "  ${YELLOW}⚠${NC} $var (not configured)"
    fi
done
echo ""

# Summary
HAS_ERRORS=0

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing required variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    HAS_ERRORS=1
fi

if [ ${#PLACEHOLDER_VARS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Variables with placeholder values:${NC}"
    for var in "${PLACEHOLDER_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    if [ "$CURRENT_ENV" != "local" ] && [ "$CURRENT_ENV" != "development" ]; then
        echo -e "${RED}❌ Placeholder values not allowed in $CURRENT_ENV environment${NC}"
        echo ""
        HAS_ERRORS=1
    fi
fi

if [ $HAS_ERRORS -eq 1 ]; then
    echo -e "${RED}Environment validation failed${NC}"
    echo ""
    echo "To fix this:"
    if [ "$CURRENT_ENV" = "local" ] || [ "$CURRENT_ENV" = "development" ]; then
        echo "  1. Run 'bun setup' to auto-configure Supabase"
    else
        echo "  1. Edit .env and fill in your $CURRENT_ENV credentials"
        echo "  2. Or create .env.$CURRENT_ENV with real values"
    fi
    echo ""
    exit 1
else
    echo -e "${GREEN}✓ Environment validation passed${NC}"
    echo ""
    exit 0
fi
