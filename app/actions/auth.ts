'use server';
import { cookies } from 'next/headers';
import { fetchTmdb } from '../lib/tmdb';
import { decrypt, encrypt } from '../lib/crypto';

const secureCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
};

//account log-in and log-out tasks
export async function getRequestToken() {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'no-store',
        body: JSON.stringify({
            redirect_to: `${process.env.NEXT_PUBLIC_BASE_URL}/approval`,
        }),
    };

    const resJson = await fetchTmdb<{ request_token: string }>(
        'https://api.themoviedb.org/4/auth/request_token',
        options,
        'fetch v4 request token from tmdb'
    );

    return resJson.request_token;
}

export async function setReqTokenCookie(rt: string) {
    (await cookies()).set('reqToken', rt, secureCookieOptions);
    if ((await cookies()).get('reqToken')?.value === rt) {
        return 'success';
    } else {
        return 'failed';
    }
}

export async function setAccountIdCookie(accId: string) {
    (await cookies()).set('accId', accId, secureCookieOptions);
}

export async function getReqTokenCookie() {
    const cookie = (await cookies()).get('reqToken')?.value;
    return cookie;
}

export async function setSessionCookies(
    sessionId: string,
    userInfo: { id: string; username: string },
    accessToken: string,
    accountObjectId: string
) {
    (await cookies()).set('sessionId', encrypt(sessionId), secureCookieOptions);
    (await cookies()).set('accId', userInfo.id, secureCookieOptions);
    (await cookies()).set('username', userInfo.username, secureCookieOptions);
    (await cookies()).set(
        'accessToken',
        encrypt(accessToken),
        secureCookieOptions
    );
    (await cookies()).set(
        'accountObjectId',
        accountObjectId,
        secureCookieOptions
    );
}

export async function getSessionId() {
    const value = (await cookies()).get('sessionId')?.value;
    if (!value) return undefined;
    try {
        return decrypt(value);
    } catch {
        console.error('failed to decrypt sessionId cookie');
        return undefined;
    }
}

export async function getAccessToken() {
    const value = (await cookies()).get('accessToken')?.value;
    if (!value) return undefined;
    try {
        return decrypt(value);
    } catch {
        console.error('failed to decrypt accessToken cookie');
        return undefined;
    }
}

export async function tmdbLogOut(accessToken: string) {
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            access_token: accessToken,
        }),
    };

    const res = await fetch(
        'https://api.themoviedb.org/4/auth/access_token',
        options
    );

    if (!res.ok) {
        console.error('failed to log out');
    }

    return await res.json();
}

export async function createTmdbSession(rt: string) {
    //create new options object for fetching session_id using request token
    const accessTokenOptions: RequestInit = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            request_token: rt,
        }),
        next: { revalidate: 60 },
    };

    const accessTokenRes = await fetch(
        'https://api.themoviedb.org/4/auth/access_token',
        accessTokenOptions
    );

    const accessTokenResJson = await accessTokenRes.json();

    if (!accessTokenRes.ok) {
        console.error('failed to get accessToken', accessTokenResJson);
    } else {
        const sessionOptions: RequestInit = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                access_token: accessTokenResJson.access_token,
            }),
            next: { revalidate: 60 },
        };

        const sessionRes = await fetch(
            'https://api.themoviedb.org/3/authentication/session/convert/4',
            sessionOptions
        );

        if (!sessionRes.ok) {
            console.error('failed to get session id from v4 access token');
        }
        const sessionResJson = await sessionRes.json();

        return { session: sessionResJson, access: accessTokenResJson };
    }
}

export async function deleteCookies() {
    (await cookies()).delete('accId');
    (await cookies()).delete('reqToken');
    (await cookies()).delete('sessionId');
    (await cookies()).delete('accessToken');
    (await cookies()).delete('accountObjectId');
    return (await cookies()).delete('username');
}

export async function getUserInfo(sessionId: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    return fetchTmdb(
        `https://api.themoviedb.org/3/account/account_id?session_id=${sessionId}`,
        options,
        'fetch account info'
    );
}
