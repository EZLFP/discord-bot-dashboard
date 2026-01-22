import NextAuth, { type DefaultSession } from "next-auth";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAuthorized: boolean;
    } & DefaultSession["user"];
  }
}

const DISCORD_API_BASE = "https://discord.com/api/v10";
const REQUIRED_SERVER_ID = process.env.DISCORD_SERVER_ID;
const ADMIN_ROLE_IDS = process.env.ADMIN_ROLE_IDS?.split(",") || [];

/**
 * Retry an async operation with exponential backoff
 */
async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't wait after the last attempt
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        const waitTime = delayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error("Retry failed");
}

/**
 * Check if a user is authorized (admin/mod in the Discord server)
 */
async function checkUserAuthorization(
  userId: string,
  accessToken: string
): Promise<boolean> {
  if (!REQUIRED_SERVER_ID || ADMIN_ROLE_IDS.length === 0) {
    console.warn(
      "DISCORD_SERVER_ID or ADMIN_ROLE_IDS not configured - allowing all users"
    );
    return true;
  }

  try {
    // Fetch user's member object for the server
    const response = await fetch(
      `${DISCORD_API_BASE}/users/@me/guilds/${REQUIRED_SERVER_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch member data: ${response.status} ${response.statusText}`
      );
    }

    const member = await response.json();
    const userRoles = member.roles || [];

    // Check if user has any of the required admin/mod roles
    const isAuthorized = userRoles.some((role: string) =>
      ADMIN_ROLE_IDS.includes(role)
    );

    if (!isAuthorized) {
      throw new Error("User does not have required roles");
    }

    return true;
  } catch (error) {
    console.error("Error checking user authorization:", error);
    throw error;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      authorization: {
        params: {
          scope: "identify email guilds guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (!account?.access_token || !account?.providerAccountId) {
        return false;
      }

      try {
        // Retry authorization check to handle Discord API timing issues
        // where OAuth permissions take a moment to propagate
        const isAuthorized = await retryAsync(
          () => checkUserAuthorization(
            account.providerAccountId!,
            account.access_token!
          ),
          3, // max retries
          1000 // initial delay: 1s, then 2s, then 4s
        );
        
        return isAuthorized;
      } catch (error) {
        console.error("Authorization check failed after retries:", error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile.id;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAuthorized = true;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
