import { cookies } from 'next/headers';
import TmdbSignIn from '../TmdbSignIn';
import TmdbSignOut from '../TmdbSignOut';
import Link from 'next/link';

export default async function SecondaryNav() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    const username = cookieStore.get('username')?.value;
    return (
        <nav
            aria-label="secondary navigation"
            className={`flex justify-between items-center w-full h-fit mb-8 sm:py-4 px-4 bg-slate-700/50`}
        >
            <div>
                {sessionId && username ? (
                    <div>
                        <p>hello {username}!</p>
                    </div>
                ) : (
                    <div>
                        <p>
                            Sign in to save movies/tv to your own lists,
                            favorites, or watchlist.
                        </p>
                    </div>
                )}
            </div>
            <ul className={`flex flex-wrap gap-y-6 m-4 w-fit sm:m-0 gap-4`}>
                <li>
                    <Link
                        className="hover:bg-slate-900 bg-slate-700/40 ring-1 ring-gray-900 px-2 py-2 text-brand-blue transition"
                        href="/dashboard/favorites"
                    >
                        dashboard
                    </Link>
                </li>
                <li>{sessionId ? <TmdbSignOut /> : <TmdbSignIn />}</li>
            </ul>
        </nav>
    );
}
