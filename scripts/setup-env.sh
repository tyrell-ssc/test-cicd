#!/bin/bash
set -e

echo "🚀 Setting up your local development environment..."
echo ""

# Create or update .env.development with auto-configured local Supabase values
echo "📝 Preparing .env.development for local Supabase credentials..."
if [ -f .env.development ]; then
    echo "⚠️  .env.development already exists. Will update Supabase credentials..."
else
    cp .env.development.example .env.development
    echo "✅ .env.development file created"
fi

echo ""
echo "🐳 Checking Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and run this script again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if Supabase is already running
if docker ps | grep -q supabase; then
    echo "✅ Supabase is already running"
else
    echo "🚀 Starting Supabase..."
    cd packages/supabase
    bunx supabase start
    cd ../..
    echo "✅ Supabase started"
fi

echo ""
echo "📊 Fetching Supabase credentials..."

# Get credentials from Supabase
cd packages/supabase
SUPABASE_STATUS=$(bunx supabase status --output json)
cd ../..

# Extract values from JSON (try new key names first, fall back to old names for compatibility)
API_URL=$(echo $SUPABASE_STATUS | grep -o '"API_URL": "[^"]*' | sed 's/"API_URL": "//')
PUBLISHABLE_KEY=$(echo $SUPABASE_STATUS | grep -o '"PUBLISHABLE_KEY": "[^"]*' | sed 's/"PUBLISHABLE_KEY": "//')
if [ -z "$PUBLISHABLE_KEY" ]; then
    PUBLISHABLE_KEY=$(echo $SUPABASE_STATUS | grep -o '"ANON_KEY": "[^"]*' | sed 's/"ANON_KEY": "//')
fi
SERVICE_ROLE_KEY=$(echo $SUPABASE_STATUS | grep -o '"SERVICE_ROLE_KEY": "[^"]*' | sed 's/"SERVICE_ROLE_KEY": "//')
if [ -z "$SERVICE_ROLE_KEY" ]; then
    SERVICE_ROLE_KEY=$(echo $SUPABASE_STATUS | grep -o '"SECRET_KEY": "[^"]*' | sed 's/"SECRET_KEY": "//')
fi
DB_URL=$(echo $SUPABASE_STATUS | grep -o '"DB_URL": "[^"]*' | sed 's/"DB_URL": "//')

# Get project name from package.json for app scheme
PROJECT_NAME=$(grep -m 1 '"name":' package.json | sed 's/.*"name": "\(.*\)".*/\1/')

# Update .env.development file with actual values
if [ "$(uname)" == "Darwin" ]; then
    # macOS
    sed -i '' "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$API_URL|" .env.development
    sed -i '' "s|EXPO_PUBLIC_SUPABASE_URL=.*|EXPO_PUBLIC_SUPABASE_URL=$API_URL|" .env.development
    sed -i '' "s|VITE_SUPABASE_PUBLISHABLE_KEY=.*|VITE_SUPABASE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY|" .env.development
    sed -i '' "s|EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=.*|EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY|" .env.development
    sed -i '' "s|SUPABASE_SECRET_KEY=.*|SUPABASE_SECRET_KEY=$SERVICE_ROLE_KEY|" .env.development
    sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY|" .env.development
    sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$DB_URL|" .env.development
    sed -i '' "s|EXPO_PUBLIC_APP_SCHEME=.*|EXPO_PUBLIC_APP_SCHEME=$PROJECT_NAME|" .env.development
else
    # Linux
    sed -i "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$API_URL|" .env.development
    sed -i "s|EXPO_PUBLIC_SUPABASE_URL=.*|EXPO_PUBLIC_SUPABASE_URL=$API_URL|" .env.development
    sed -i "s|VITE_SUPABASE_PUBLISHABLE_KEY=.*|VITE_SUPABASE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY|" .env.development
    sed -i "s|EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=.*|EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY|" .env.development
    sed -i "s|SUPABASE_SECRET_KEY=.*|SUPABASE_SECRET_KEY=$SERVICE_ROLE_KEY|" .env.development
    sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY|" .env.development
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=$DB_URL|" .env.development
    sed -i "s|EXPO_PUBLIC_APP_SCHEME=.*|EXPO_PUBLIC_APP_SCHEME=$PROJECT_NAME|" .env.development
fi

echo "✅ Supabase credentials saved to .env.development"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Supabase Configuration Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "API URL: $API_URL"
echo "Publishable Key: ${PUBLISHABLE_KEY:0:20}..."
echo "Service Role Key: ${SERVICE_ROLE_KEY:0:20}..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📊 Setting up database schema..."
echo ""

# Push database schema and run migrations
if bun db:push; then
    echo ""
    echo "✅ Database schema and migrations applied successfully"
else
    echo ""
    echo "❌ Failed to push database schema"
    echo "💡 You can try manually running 'bun db:push' to retry"
    exit 1
fi

# Check if PostHog is configured
if grep -q "VITE_POSTHOG_KEY" .env.development; then
    echo ""
    echo "📊 PostHog Setup (Analytics)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Go to: https://app.posthog.com/project/settings"
    echo "2. Copy your Project API Key"
    echo "3. Update in .env.development:"
    echo "   - VITE_POSTHOG_KEY"
    echo "   - EXPO_PUBLIC_POSTHOG_KEY"
    echo ""
    echo "💡 Skip this if you don't want analytics yet"
fi

# Check if Sentry is configured
if grep -q "VITE_SENTRY_DSN" .env.development; then
    echo ""
    echo "🐛 Sentry Setup (Error Tracking)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Go to: https://sentry.io/settings/projects/your-project/keys/"
    echo "2. Copy your DSN, organization, and project name"
    echo "3. Update in .env.development:"
    echo "   - VITE_SENTRY_DSN / EXPO_PUBLIC_SENTRY_DSN"
    echo "   - VITE_SENTRY_ORG / EXPO_PUBLIC_SENTRY_ORG"
    echo "   - VITE_SENTRY_PROJECT / EXPO_PUBLIC_SENTRY_PROJECT"
    echo "   - SENTRY_AUTH_TOKEN (for build scripts only)"
    echo ""
    echo "💡 Skip this if you don't want error tracking yet"
fi

# Check if RevenueCat is configured
if grep -q "VITE_REVENUECAT_API_KEY" .env.development; then
    echo ""
    echo "💳 RevenueCat Setup (Monetization)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Go to: https://app.revenuecat.com/projects"
    echo "2. Copy your Public API Key"
    echo "3. Update in .env.development:"
    echo "   - VITE_REVENUECAT_API_KEY"
    echo "   - EXPO_PUBLIC_REVENUECAT_API_KEY"
    echo "4. For iOS, also set:"
    echo "   - EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY"
    echo "5. For Android, also set:"
    echo "   - EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY"
    echo ""
    echo "💡 Skip this if you don't want in-app purchases yet"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next steps:"
echo "1. Review .env.development and add any optional service credentials"
echo "2. Run 'bun dev' to start development"
echo ""
echo "💡 Environment switching:"
echo "   Your local credentials are in .env.development"
echo "   Run 'bun dev' for local development (uses .env.development)"
echo "   Run 'bun dev:staging' to test against staging"
echo "   Run 'bun dev:production' to test against production"
echo ""
echo "🗄️  Database management:"
echo "   View database: 'bun db:studio' (opens Drizzle Studio)"
echo "   Update schema: Edit packages/db/src/schema.ts, then 'bun db:push'"
echo ""
