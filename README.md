# test-cicd

Generated with [@secret-studio/create-app](https://github.com/nintyboy/create-app-wizard)

## Getting Started

```bash
bun install
bun setup     # Auto-configure environment
bun db:push   # Push database schema
bun dev       # Start all apps
```

## Scripts

- `bun dev` - Start all apps in development mode
- `bun dev:web` - Start web app (http://localhost:3000)
- `bun dev:mobile` - Start mobile app (Expo)
- `bun dev:admin` - Start admin panel (http://localhost:3001)

## Code Quality

This project includes comprehensive linting and formatting:

### Tools

- **ESLint** - TypeScript, React, React Native rules
- **Prettier** - Consistent code formatting
- **Husky** - Git hooks for quality enforcement
- **commitlint** - Conventional commit messages

### Commands

- `bun run lint` - Check code for errors
- `bun run lint:fix` - Auto-fix linting issues
- `bun run format` - Format all files
- `bun run validate` - Run all checks

### Git Hooks

Pre-commit hooks automatically:

- Lint and fix staged files
- Format staged files
- Validate commit messages

### Commit Message Format

```
<type>(<scope>): <subject>
```

**Types:** feat, fix, docs, style, refactor, perf, test, chore

**Examples:**

- `feat(auth): add magic link authentication`
- `fix(mobile): resolve navigation crash`

## CI/CD

This project uses GitHub Actions for automated deployments.

### Deployment Strategy

- **Patch** (1.0.x): Auto-deploy, OTA updates only
- **Minor** (1.x.0): Auto-deploy with tests, OTA updates only
- **Major** (x.0.0): Manual approval, full app store builds

### Making a Release

```bash
# Patch (bug fixes)
bun run release:patch

# Minor (new features)
bun run release:minor

# Major (breaking changes)
bun run release:major
```

### Setup Required

See `scripts/setup-cicd.md` for detailed setup instructions.

Secrets needed:

- Netlify: `NETLIFY_AUTH_TOKEN`, site IDs
- Expo: `EXPO_TOKEN`

## Project Structure

```
test-cicd/
├── apps/           # Applications
│   ├── web/       # Web app (Vite + TanStack Router)
│   ├── mobile/    # Mobile app (Expo)
│   └── admin/     # Admin panel
├── packages/      # Shared packages
│   ├── ui/        # UI components
│   ├── app/       # Shared screens & logic
│   ├── db/        # Database (Drizzle ORM)
│   └── supabase/  # Supabase client
└── scripts/       # Setup & validation scripts
```

## Environment Setup

See `.env.example` for required environment variables.

Run `bun setup` to auto-configure local development environment.

## Learn More

- [Vite](https://vite.dev)
- [Expo](https://expo.dev)
- [TanStack Router](https://tanstack.com/router)
- [NativeWind](https://nativewind.dev)
- [Supabase](https://supabase.com)
- [Drizzle ORM](https://orm.drizzle.team)
