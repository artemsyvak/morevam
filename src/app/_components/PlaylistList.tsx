'use client'

import React, { useState } from 'react';
import { api } from '~/trpc/react';

const PlaylistList = () => {
    const { data: result, isError } = api.spotify.getPlaylists.useQuery();
    const playlists = result;
    const [viewMode, setViewMode] = useState('grid');

    if (isError || !playlists?.length) {
        return (
            <div className="text-gray-400 p-4 text-center">
                No playlists available
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* TODO: implement flexible option for grid view */}
            {/* <div className="flex justify-start mb-4">
                <button
                    className={`mr-2 ${viewMode === 'grid' ? 'text-white' : 'text-gray-400'}`}
                    onClick={() => setViewMode('grid')}
                >
                    Grid View
                </button>
                <button
                    className={`${viewMode === 'list' ? 'text-white' : 'text-gray-400'}`}
                    onClick={() => setViewMode('list')}
                >
                    List View
                </button>
            </div> */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-yb-2'}>
                {playlists.map((playlist) => (
                    <div
                        key={playlist.id}
                        className={`relative hover:bg-gray-800 p-4 rounded transition-colors cursor-pointer group ${viewMode === 'grid' ? 'h-50 max-md:h-60' : 'flex-row'}`}
                    >
                        <img
                            src={playlist?.images[0]?.url}
                            alt={`${playlist.name} playlist cover`}
                            className="w-full h-60 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 rounded-md bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button
                                className="text-white"
                                aria-label="Play playlist"
                            >
                                Play
                            </button>
                        </div>
                        <div className="bottom-0 left-0 right-0 p-4 pl-0">
                            <h3 className="text-white font-semibold text-lg truncate">
                                {playlist.name}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {playlist.owner.display_name} {playlist.collaborative && '• Collaborator'}
                            </p>
                            <p className="text-gray-400 text-sm">
                                100 likes
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistList;