import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { scopes, spotifyApi } from "~/lib/spotify";

import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      accessToken: string;
      refreshToken: string;
      username: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      // authorization: {
      //   params: {
      //     scope: scopes,
      //   }
      // }
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token, user, account }) {    
  
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000,
        };
      }

      //  @ts-ignore
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
           
      return await refreshAccessToken(token);
    },   
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.user.username = token.username as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig;


async function refreshAccessToken(token: any) {
  try {
    spotifyApi.setRefreshToken(token.refreshToken);
    spotifyApi.setAccessToken(token.accessToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
