'use client';

import { deleteCookies, getAccessToken, tmdbLogOut } from '../actions/auth';
import { useEffect } from 'react';

export default function LogOut() {
    useEffect(() => {
        async function removeCookies() {
            const accessToken: string | undefined = await getAccessToken();
            if (accessToken) {
                await tmdbLogOut(accessToken);
            }
            await deleteCookies();
        }

        // A full document load, not router.replace: the sign-in state in the
        // nav lives in the root layout, which persists across a client-side
        // transition and would keep rendering the signed-in cookie snapshot.
        removeCookies().then(() => window.location.replace('/'));
    }, []);

    return (
        <div className="text-center my-8">
            <p>you&apos;ve successfully logged out</p>
            <p>taking you home...</p>
        </div>
    );
}
