import Link from "next/link";
import { api } from "~/trpc/server";
import { auth, signIn, signOut } from "~/server/auth";

const Header = async () => {
    const session = await auth();
    const profile = session ? await api.spotify.getProfile() : null;

    return (
        <header className="flex items-center justify-between p-4 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <Link href="/" className="text-2xl font-bold">
                morevam.
            </Link>
            {session && profile ? (
                <div className="relative group">
                    <img
                        src={profile.images?.[0]?.url}
                        height={profile.images?.[0]?.height}
                        width={profile.images?.[0]?.width}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                    <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="block px-4 py-2 text-gray-800">{profile.display_name}</span>
                        <Link href="/playlists" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                            Playlists
                        </Link>
                        <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                            Profile
                        </Link>
                        <Link href="/jam" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                            Jam
                        </Link>
                        <button
                            onClick={async () => {
                                "use server";
                                await signOut({ redirectTo: '/' });
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={async () => {
                        "use server";
                        await signIn('spotify', { redirectTo: '/playlists' });
                    }}
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                >
                    Sign in
                </button>
            )}
        </header>
    );
};

export default Header;