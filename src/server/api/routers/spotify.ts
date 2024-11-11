// src/trpc/router.ts
import { z } from "zod";
import getServerSession from "next-auth";
import { authConfig } from "~/server/auth/config";
import { spotifyApi } from "~/lib/spotify";
import { TRPCError } from "@trpc/server";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";


export const spotifyRouter = createTRPCRouter({
    getPlaylists: publicProcedure.
        query(async ({ ctx }) => {
            if (!ctx.session?.accessToken) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            return spotifyApi(ctx.session?.accessToken).getPlaylists();
        }),

    createPlaylist: publicProcedure
        .input(z.object({ name: z.string(), description: z.string().optional() }))
        .mutation(async ({ input, ctx }) => {           
            if (!ctx.session?.accessToken) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            return spotifyApi(ctx.session.accessToken).createPlaylist(input.name, input.description);
        }),

    updatePlaylist: publicProcedure
        .input(z.object({ playlistId: z.string(), tracks: z.array(z.string()) }))
        .mutation(async ({ input, ctx }) => {
            const session = await getServerSession(authConfig);
            if (!ctx.session?.accessToken) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            return spotifyApi(ctx.session.accessToken).updatePlaylist(input.playlistId, input.tracks);
        }),

    searchTracks: publicProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ input, ctx }) => {           
            if (!ctx.session?.accessToken) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            return spotifyApi(ctx.session.accessToken).searchTracks(input.query);
        }),
});