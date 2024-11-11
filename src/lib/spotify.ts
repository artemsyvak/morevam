
import { SpotifyApi } from '../types/spotify'

type SpotifyAPI = {
    getPlaylists: () => Promise<SpotifyApi.ListOfUsersPlaylistsResponse>;
    createPlaylist: (name: string, description?: string) => Promise<SpotifyApi.CreatePlaylistResponse>;
    updatePlaylist: (playlistId: string, tracks: string[]) => Promise<SpotifyApi.SnapshotResponse>;
    searchTracks: (query: string) => Promise<SpotifyApi.TrackSearchResponse>;
};

export const spotifyApi = (accessToken: string): SpotifyAPI => {
    const BASE_URL = "https://api.spotify.com/v1";
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };

    return {
        async getPlaylists() {
            const response = await fetch(`${BASE_URL}/me/playlists`, { headers });
            return response.json();
        },

        async createPlaylist(name: string, description?: string) {
            const response = await fetch(`${BASE_URL}/me/playlists`, {
                method: "POST",
                headers,
                body: JSON.stringify({ name, description, public: false }),
            });
            return response.json();
        },

        async updatePlaylist(playlistId: string, tracks: string[]) {
            const response = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ uris: tracks }),
            });
            return response.json();
        },

        async searchTracks(query: string) {
            const response = await fetch(
                `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
                { headers }
            );
            return response.json();
        },
    };
};