# EZLFP Analytics Dashboard

A modern, real-time analytics dashboard for the EZLFP Discord bot built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Real-time Queue Monitoring** - Live updates every 15 seconds showing current players in queue
- **Comprehensive Analytics** - Overview stats, match performance, user growth, command usage
- **Interactive Charts** - Trends visualization using Recharts
- **Discord OAuth Authentication** - Secure access restricted to server admins/moderators
- **Dark Mode** - Fully themed with light/dark mode support
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Cost Optimized** - Smart caching strategy (1-2 min) to minimize API calls

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Authentication**: NextAuth.js v5 (Auth.js) with Discord provider
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ installed
- A Discord OAuth application ([create one here](https://discord.com/developers/applications))
- Your EZLFP bot running and accessible at an API URL
- Discord server ID and admin/mod role IDs

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Bot API URL (where your EZLFP bot is running)
NEXT_PUBLIC_BOT_API_URL=http://localhost:3000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>

# Discord OAuth Application
AUTH_DISCORD_ID=your-discord-client-id
AUTH_DISCORD_SECRET=your-discord-client-secret

# Discord Server & Role Configuration
DISCORD_SERVER_ID=your-server-id
ADMIN_ROLE_IDS=role-id-1,role-id-2
```

### 3. Set Up Discord OAuth App

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Go to OAuth2 → General
4. Add redirect URL: `http://localhost:3001/api/auth/callback/discord`
5. Copy your Client ID and Client Secret to `.env.local`
6. Enable these OAuth2 scopes:
   - `identify`
   - `email`
   - `guilds`
   - `guilds.members.read`

### 4. Get Discord Server & Role IDs

**Server ID:**
1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click your server → Copy Server ID

**Role IDs:**
1. Go to Server Settings → Roles
2. Right-click the admin/mod roles → Copy Role ID
3. Add to `.env.local` as comma-separated list: `ADMIN_ROLE_IDS=123456789,987654321`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel
```

**Important:** Update these environment variables for production:

```env
NEXT_PUBLIC_BOT_API_URL=https://your-production-bot-url.com
NEXTAUTH_URL=https://your-dashboard-url.vercel.app
```

Also add the production callback URL to your Discord OAuth app:
```
https://your-dashboard-url.vercel.app/api/auth/callback/discord
```

## Dashboard Sections

### Overview
- Total users, matches, success rates, commands
- High-level summary cards

### Live Queue Status
- Real-time player counts per game/mode
- Auto-refreshes every 15 seconds
- Color-coded status indicators

### Match Performance
- Acceptance rates and match quality scores
- Pie chart showing match outcomes
- Success/decline/timeout breakdown

### Trends (30 Days)
- Total users over time
- Matches per day
- Queue joins per day
- Average wait time

### Command Statistics
- Sortable table of all commands
- Success rates and execution times
- Click headers to sort

### Recent Activity
- Live feed of recent events
- Last 7 days of activity
- Color-coded by event type

### User Statistics
- User growth and activity rates
- Game distribution (LOL vs VAL)
- New vs returning users

## API Endpoints Used

The dashboard consumes these analytics endpoints from your bot:

- `GET /api/analytics/overview`
- `GET /api/analytics/commands`
- `GET /api/analytics/queues`
- `GET /api/analytics/matches`
- `GET /api/analytics/events`
- `GET /api/analytics/users`
- `GET /api/analytics/daily-metrics`

See `ANALYTICS_API_REFERENCE.md` for full API documentation.

## Project Structure

```
ezlfp-dashboard/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Main dashboard page
│   ├── auth/
│   │   ├── signin/page.tsx     # Discord sign-in page
│   │   └── error/page.tsx      # Auth error page
│   └── api/auth/[...nextauth]/ # NextAuth API routes
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── dashboard/              # Dashboard section components
│   ├── stat-card.tsx           # Reusable metric card
│   ├── theme-toggle.tsx        # Dark mode toggle
│   └── navbar.tsx              # Navigation header
├── lib/
│   ├── analytics.ts            # API client with caching
│   ├── auth.ts                 # NextAuth configuration
│   └── utils.ts                # Utility functions
├── types/
│   └── analytics.ts            # TypeScript type definitions
└── .env.local                  # Environment variables
```

## Troubleshooting

### "Failed to fetch analytics"
- Verify `NEXT_PUBLIC_BOT_API_URL` is correct
- Ensure your bot API is running and accessible
- Check CORS settings on your bot API

### "Access Denied" on Sign In
- Verify your Discord user ID is in the server
- Check that you have one of the roles listed in `ADMIN_ROLE_IDS`
- Ensure `DISCORD_SERVER_ID` matches your server

### OAuth Redirect Error
- Verify `NEXTAUTH_URL` matches your current URL
- Check Discord OAuth redirect URLs match exactly
- Ensure `AUTH_DISCORD_ID` and `AUTH_DISCORD_SECRET` are correct

### Charts Not Rendering
- Check browser console for errors
- Verify API is returning data in the correct format
- Ensure `recharts` is installed

## Contributing

This dashboard was built for the EZLFP Discord bot. Feel free to adapt it for your own bot!

## License

ISC

## Support

For issues with the dashboard, check the troubleshooting section above. For EZLFP bot-specific questions, contact the bot administrator.
