// src/trpc/router.ts
import { z } from "zod";
import { spotifyApi } from "~/lib/spotify";
import { TRPCError } from "@trpc/server";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";


export const spotifyRouter = createTRPCRouter({

    getProfile: protectedProcedure.
        query(async ({ ctx }) => {
            if (!ctx.session?.user.accessToken) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            const data = await spotifyApi.getMe()
            return data.body
        }),

    getPlaylists: protectedProcedure.
        query(async ({ ctx }) => {
            if (!ctx.session?.user.accessToken) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            const data = await spotifyApi.getUserPlaylists()
            return data.body.items
        }),

    createPlaylist: protectedProcedure
        .input(z.object({ name: z.string(), description: z.string().optional() }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session?.user.accessToken) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            return spotifyApi.createPlaylist(input.name, {
                description: input.description
            });
        }),


    updatePlaylist: protectedProcedure
        .input(z.object({ playlistId: z.string(), tracks: z.array(z.string()) }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session?.user.accessToken) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            return spotifyApi.addTracksToPlaylist(input.playlistId, input.tracks);
        }),

    searchTracks: protectedProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ input, ctx }) => {           
            if (!ctx.session?.user.accessToken) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            return spotifyApi.searchTracks(input.query);
        }),
});