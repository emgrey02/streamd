'use client';

import { useSyncExternalStore } from 'react';

// Reads the non-httpOnly 'username' cookie set alongside the session cookies
// in setSessionCookies (and cleared alongside them in deleteCookies), so its
// presence is an accurate client-readable proxy for "signed in" -- without
// calling next/headers' cookies(), which would force the page dynamic.
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

export function useUsername(): string | undefined {
    return useSyncExternalStore(subscribe, getUsernameCookie, getServerSnapshot);
}
