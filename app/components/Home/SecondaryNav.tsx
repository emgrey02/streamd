'use client';

import { useSyncExternalStore } from 'react';
import TmdbSignIn from '../TmdbSignIn';
import TmdbSignOut from '../TmdbSignOut';
import DashboardLink from './DashboardLink';

// Reads the non-httpOnly 'username' cookie set alongside the session cookies
// in setSessionCookies (and cleared alongside them in deleteCookies), so its
// presence is an accurate client-readable proxy for "signed in". Cookies
// aren't a subscribable store, so there's nothing to notify on -- this only
// needs to read the value once, after mount.
function getUsernameCookie(): string | undefined {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith('username='));
    return match ? decodeURIComponent(match.split('=')[1]) : undefined;
}

function subscribe() {
    return () => {};
}

function getServerSnapshot() {
    return undefined;
}

export default function SecondaryNav() {
    const username = useSyncExternalStore(
        subscribe,
        getUsernameCookie,
        getServerSnapshot
    );

    return (
        <nav
            aria-label="secondary navigation"
            className={`flex justify-between items-center w-full h-fit mb-8 sm:py-4 px-4 bg-slate-700/50`}
        >
            <div>
                {username ? (
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
                    <DashboardLink />
                </li>
                <li>{username ? <TmdbSignOut /> : <TmdbSignIn />}</li>
            </ul>
        </nav>
    );
}
