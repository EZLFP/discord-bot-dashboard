# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EZLFP Analytics Dashboard - A real-time analytics dashboard for the EZLFP Discord bot built with Next.js 16 (App Router), TypeScript, and Tailwind CSS. Displays queue status, match analytics, command usage, and user statistics.

## Commands

```bash
npm run dev      # Start dev server on port 3001
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Server vs Client Components
- **Server components** (default): Handle data fetching with ISR caching via `fetchWithCache()` in `lib/analytics.ts`
- **Client components** (marked with `"use client"`): Handle interactivity, charts, and real-time polling
- Pattern: Server components fetch data and pass to client component wrappers for interactivity

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/dashboard/` - Dashboard section components (server + client pairs)
- `components/ui/` - Shadcn-style reusable UI primitives
- `lib/analytics.ts` - API client with ISR caching (60-120s revalidation)
- `lib/auth.ts` - NextAuth v5 config with Discord OAuth and role-based access
- `types/analytics.ts` - TypeScript interfaces for all API responses

### Authentication
Discord OAuth with role-based access control:
- Validates user membership in configured Discord server
- Checks for admin/moderator roles (comma-separated in `ADMIN_ROLE_IDS`)
- Uses `retryAsync()` with exponential backoff for Discord API timing issues
- Export `auth()` from `lib/auth.ts` to get session in server components

### Data Fetching
- Server components use `lib/analytics.ts` functions with Next.js ISR caching
- `live-queue-status.tsx` uses client-side polling (15-second intervals) with `cache: 'no-store'`
- All analytics data comes from external bot API at `NEXT_PUBLIC_BOT_API_URL`

### Styling
- Tailwind CSS with dark mode via `next-themes`
- Use `cn()` from `lib/utils.ts` to merge Tailwind classes
- CSS variables define colors (HSL format) - see `app/globals.css`
- Utility functions: `formatNumber()`, `formatPercentage()`, `formatDuration()`

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_BOT_API_URL    # Bot analytics API URL
NEXTAUTH_URL               # Dashboard URL (http://localhost:3001 for dev)
NEXTAUTH_SECRET            # Generate with: openssl rand -base64 32
AUTH_DISCORD_ID            # Discord OAuth client ID
AUTH_DISCORD_SECRET        # Discord OAuth client secret
DISCORD_SERVER_ID          # Discord server to check membership
ADMIN_ROLE_IDS             # Comma-separated role IDs for access control
```
