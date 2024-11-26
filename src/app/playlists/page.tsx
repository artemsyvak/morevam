import { HydrateClient } from "~/trpc/server";

import PlaylistList from "~/app/_components/PlaylistList";
import Header from "../_components/Header";

export default async function Home() {
    return (
        <HydrateClient>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-12">
                    <div className="flex flex-col items-center gap-2 w-full">
                        <h2 className="w-full text-left font-extrabold tracking-left text-5xl pl-3">
                            <span className="from-neutral-100">public playlists</span>
                        </h2>
                        <PlaylistList />
                    </div>
                </div>
            </main>
        </HydrateClient>
    );
}
