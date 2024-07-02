'use server';
import { cookies } from 'next/headers';

export async function setReqToken(rt: string) {
    console.log('setting request token cookie');
    cookies().set('reqToken', rt);
    if (cookies().get('reqToken')?.value === rt) {
        return 'success';
    } else {
        return 'failed';
    }
}

export async function getReqToken() {
    console.log('getting request token cookie');
    const cookie = cookies().get('reqToken')?.value;
    return cookie;
}

export async function setSessionCookies(s: any) {
    console.log('setting user session cookies');
    cookies().set('accId', s.account_id);
    cookies().set('accToken', s.access_token);
}

export async function getAccessToken() {
    return cookies().get('accToken')?.value;
}

export async function tmdbLogOut(at: string) {
    console.log(at);
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            access_token: at,
        }),
    };

    let res = await fetch(
        'https://api.themoviedb.org/4/auth/access_token',
        options
    );

    if (!res.ok) {
        console.error('failed to log out');
    } else {
        console.log('successfully logged out');
    }

    return await res.json();
}

export async function getTmdbSession(rt: string) {
    //create new options object for fetching session_id using request token
    const sessionOptions: RequestInit = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            request_token: rt,
        }),
        cache: 'no-store',
    };

    const sessionRes = await fetch(
        'https://api.themoviedb.org/4/auth/access_token',
        sessionOptions
    );

    if (!sessionRes.ok) {
        console.error('failed to get access token');
    }

    const sessionResJson = await sessionRes.json();
    console.log(sessionResJson);
    return sessionResJson;
}

export async function deleteCookies() {
    console.log(`deleting cookies`);
    cookies().delete('accId');
    cookies().delete('reqToken');
    return cookies().delete('accToken');
}

export async function getContentAccountInfo(
    content: string,
    contentId: string
) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/${content}/${contentId}/account_states`,
        options
    );

    if (!res.ok) {
        console.error('failed to get content account info');
    }

    return await res.json();
}

export async function getContent(
    content: string,
    cat: string | null,
    pageNum: number
) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/${content}/${cat}?language=en-US&page=${pageNum}`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch content');
    }

    return await res.json();
}

export async function getFavorWatch(
    whichOne: string,
    accountId: string,
    content: string
) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/4/account/${accountId}/${content}/${whichOne}?language=en-US&page=1&sort_by=created_at.asc`,
        options
    );

    if (!res.ok) {
        console.error(`failed to fetch ${whichOne} ${content}s`);
    }

    let favorWatch = await res.json();
    // console.log(favorWatch);
    return favorWatch.results;
}

interface body {
    media_type: string;
    media_id: number;
    favorite?: boolean;
    watchlist?: boolean;
}

export async function addToFavorWatch(
    whichOne: string,
    type: string,
    contentId: string,
    accountId: string
) {
    let body: body;

    if (whichOne === 'favorite') {
        body = {
            media_type: type,
            media_id: +contentId,
            favorite: true,
        };
    } else {
        body = {
            media_type: type,
            media_id: +contentId,
            watchlist: true,
        };
    }

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/${whichOne}`,
        options
    );

    if (!res.ok) {
        console.log(`failed to get ${whichOne}`);
        console.error(await res.json());
        return false;
    } else {
        console.log(`success in adding ${type} to ${whichOne}`);
        return true;
    }
}

export async function removeFavorWatch(
    whichOne: string,
    type: string,
    contentId: string,
    accountId: string
) {
    let body: body;

    if (whichOne === 'favorite') {
        body = {
            media_type: type,
            media_id: +contentId,
            favorite: false,
        };
    } else {
        body = {
            media_type: type,
            media_id: +contentId,
            watchlist: false,
        };
    }
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/${whichOne}`,
        options
    );

    if (!res.ok) {
        console.error('failed', await res.json());
        return false;
    } else {
        console.log(`success in removing ${type} from ${whichOne}`);
        return true;
    }
}
