'use server';
import { fetchTmdb } from '../lib/tmdb';
import {
    getAccessToken,
    getAccountId,
    getAccountObjectId,
    getSessionId,
} from './auth';

export async function getContentAccountInfo(
    sessionId: string,
    content: string,
    contentId: number,
    seasonNum?: string,
    episodeNum?: string
) {
    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'no-store',
    };

    const url =
        seasonNum && episodeNum ?
            `https://api.themoviedb.org/3/${content}/${contentId}/season/${seasonNum}/episode/${episodeNum}/account_states?session_id=${sessionId}`
        :   `https://api.themoviedb.org/3/${content}/${contentId}/account_states?session_id=${sessionId}`;

    return fetchTmdb(url, options, 'get content account info');
}

// Called client-side (from UserContentInfoBox) instead of during the page's
// server render, so movie/tv detail pages can stay statically cached instead
// of every view forcing a dynamic render just to check sign-in state.
export async function getContentUserState(content: string, contentId: number) {
    const [sessionId, accessToken, accountId, accountObjectId] =
        await Promise.all([
            getSessionId(),
            getAccessToken(),
            getAccountId(),
            getAccountObjectId(),
        ]);

    if (!sessionId || !accountId) {
        return null;
    }

    const favWatchRated = await getContentAccountInfo(
        sessionId,
        content,
        contentId
    );

    return {
        favorite: Boolean(favWatchRated.favorite),
        watchlist: Boolean(favWatchRated.watchlist),
        sessionId,
        accessToken: accessToken || '',
        accountId,
        accountObjectId: accountObjectId || '',
    };
}

//favorite, add to watchlist, rate

interface body {
    media_type: string;
    media_id: number;
    favorite?: boolean;
    watchlist?: boolean;
}

export async function addToFavorWatch(
    whichOne: string,
    type: string,
    contentId: number,
    accountId: string,
    sessionId: string
) {
    let body: body;

    if (whichOne === 'favorite') {
        body = {
            media_type: type,
            media_id: contentId,
            favorite: true,
        };
    } else {
        body = {
            media_type: type,
            media_id: contentId,
            watchlist: true,
        };
    }

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/${whichOne}?session_id=${sessionId}`,
        options
    );

    if (!res.ok) {
        console.error(`failed to add ${type} to ${whichOne}`, await res.json());
        return false;
    } else {
        return true;
    }
}

export async function removeFavorWatch(
    whichOne: string,
    type: string,
    contentId: number,
    accountId: string,
    sessionId: string
) {
    let body: body;

    if (whichOne === 'favorite') {
        body = {
            media_type: type,
            media_id: contentId,
            favorite: false,
        };
    } else {
        body = {
            media_type: type,
            media_id: contentId,
            watchlist: false,
        };
    }
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/${whichOne}?session_id=${sessionId}`,
        options
    );

    if (!res.ok) {
        console.error(`failed to remove ${type} from ${whichOne}`, await res.json());
        return false;
    } else {
        return true;
    }
}

export async function deleteRating(
    content: string,
    id: number,
    sessionId: string,
    seasonNum?: string,
    episodeNum?: string
) {
    let res;

    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    if (seasonNum && episodeNum) {
        res = await fetch(
            `https://api.themoviedb.org/3/${content}/${id}/season/${seasonNum}/episode/${episodeNum}/rating?session_id=${sessionId}`,
            options
        );
    } else {
        res = await fetch(
            `https://api.themoviedb.org/3/${content}/${id}/rating?session_id=${sessionId}`,
            options
        );
    }

    const resJson = await res.json();

    if (!res.ok) {
        console.error(`failed to rate this ${content}`, resJson);
    }

    return resJson;
}

export async function rateContent(
    content: string,
    id: number,
    rating: number,
    sessionId: string,
    seasonNum?: string,
    episodeNum?: string
) {
    let res;

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            value: rating,
        }),
    };

    if (seasonNum && episodeNum) {
        res = await fetch(
            `https://api.themoviedb.org/3/${content}/${id}/season/${seasonNum}/episode/${episodeNum}/rating?session_id=${sessionId}`,
            options
        );
    } else {
        res = await fetch(
            `https://api.themoviedb.org/3/${content}/${id}/rating?session_id=${sessionId}`,
            options
        );
    }

    const resJson = await res.json();

    if (!res.ok) {
        console.error(`failed to rate this ${content}`, resJson);
    }

    return resJson;
}
