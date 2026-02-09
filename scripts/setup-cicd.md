# CI/CD Setup Guide

This project uses **GitHub Actions** for automated deployments. Everything is handled in CI - no local scripts needed!

## Quick Start

1. **Set GitHub Secrets**
2. **Push to GitHub**
3. **Create a tag** → GitHub Actions does the rest!

---

## Step 1: Set GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Required Secrets:

```bash
# Netlify (for web/admin deployments)
NETLIFY_AUTH_TOKEN=your-netlify-token-here

# Expo (for mobile OTA updates)
EXPO_TOKEN=your-expo-token-here
```

### Where to get tokens:

**Netlify Token:**

1. Go to https://app.netlify.com/user/applications#personal-access-tokens
2. Click "New access token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token and add as \`NETLIFY_AUTH_TOKEN\` secret

**Expo Token:**

1. Go to https://expo.dev/settings/access-tokens
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token and add as \`EXPO_TOKEN\` secret

---

## Step 2: Push to GitHub & Create Tag

```bash
# Push your code
git push origin main

# Create a release tag
git tag v1.0.0
git push --tags
```

**That's it!** GitHub Actions automatically:

- Creates Netlify sites (first run)
- Syncs environment variables
- Deploys everything

Check the **Actions** tab to watch it happen!

---

## Troubleshooting

### "Netlify sites not found"

- Check \`NETLIFY_AUTH_TOKEN\` is set in GitHub Secrets
- Token needs permission to create sites

### "Expo token invalid"

- Check \`EXPO_TOKEN\` is set in GitHub Secrets
- Verify at https://expo.dev/settings/access-tokens

---

## Manual Setup (Optional)

Go to **Actions** → **Setup Deployment** → **Run workflow**

This lets you manually trigger site creation for staging/production.
