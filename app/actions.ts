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

export async function deleteCookie(name: string) {
    console.log(`deleting ${name} cookie`);
    return cookies().delete(name);
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

export async function getFavorites(accountId: string, content: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/4/account/${accountId}/${content}/favorites?language=en-US&page=1&sort_by=created_at.asc`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch favorite movies');
    }

    let favorites = await res.json();
    return favorites.results;
}

export async function addToFavorites(
    type: string,
    contentId: string,
    accountId: string
) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            media_type: type,
            media_id: +contentId,
            favorite: true,
        }),
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/favorite/`,
        options
    );

    if (!res.ok) {
        console.error(await res.json());
        return false;
    } else {
        return true;
    }
}

export async function removeFavorite(
    type: string,
    contentId: string,
    accountId: string
) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            media_type: type,
            media_id: +contentId,
            favorite: false,
        }),
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/favorite`,
        options
    );

    if (!res.ok) {
        console.error(await res.json());
        return false;
    } else {
        return true;
    }
}
