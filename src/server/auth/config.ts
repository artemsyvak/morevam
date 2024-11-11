import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import { db } from "~/server/db";


const SPOTIFY_SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-email",
  "user-read-private",
  "user-library-read",
];

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
    accessToken?: string
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,     
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  // callbacks: {
  //   async jwt({ token, account }) {
  //     if (account) {
  //       token.accessToken = account.access_token;
  //       token.refreshToken = account.refresh_token;
  //       token.expiresAt = account.expires_at;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     session.accessToken = token.accessToken as string;
  //     return session;
  //   },
  // },
  // callbacks: {
  //   async jwt({ token, account }) {
  //     if (account) {
  //       token.accessToken = account.access_token;
  //       token.refreshToken = account.refresh_token;
  //       token.expiresAt = account.expires_at;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     session.accessToken = token.accessToken;
  //     return session;
  //   },
  // },
  // pages: {
  //   signIn: "/login",
  // },
} satisfies NextAuthConfig;
