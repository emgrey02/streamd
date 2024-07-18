'use server';
import { cookies } from 'next/headers';

export async function getShowInfo(showId: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?append_to_response=images,aggregate_credits,keywords,recommendations,similar,videos,watch_providers,reviews&language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show data');
    }

    return await res.json();
}

export async function getPersonInfo(personId: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/person/${personId}?append_to_response=combined_credits&language=en-US&sort_by=primary_release_date.asc`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    return await res.json();
}

export async function getMovieInfo(movieId: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=images,credits,keywords,recommendations,similar,videos,watch_providers,reviews`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    return await res.json();
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

    //error handling
    if (!res.ok) {
        console.log(resJson);
        console.error(`failed to rate this ${content}`);
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

    //error handling
    if (!res.ok) {
        console.log(resJson);
        console.error(`failed to rate this ${content}`);
    }

    return resJson;
}

export async function getRequestToken() {
    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        next: { revalidate: 60 },
    };

    options.next as RequestInit;

    //fetch to get a request token from TMDB
    const res = await fetch(
        'https://api.themoviedb.org/3/authentication/token/new',
        options
    );

    //error handling
    if (!res.ok) {
        console.error('failed to fetch request token from tmdb');
    }

    //assign request Token
    const resJson = await res.json();
    const reqToken = resJson.request_token;
    console.log('successfully got request token from tmdb');
    console.log(resJson);
    return reqToken;
}

export async function setReqTokenCookie(rt: string) {
    console.log('setting request token cookie');
    cookies().set('reqToken', rt);
    if (cookies().get('reqToken')?.value === rt) {
        return 'success';
    } else {
        return 'failed';
    }
}

export async function setAccountIdCookie(accId: string) {
    console.log('setting account id cookie');
    cookies().set('accId', accId);
}

export async function getReqTokenCookie() {
    console.log('getting request token cookie');
    const cookie = cookies().get('reqToken')?.value;
    return cookie;
}

export async function setSessionCookies(
    sessionId: string,
    userInfo: { id: string; username: string }
) {
    console.log(sessionId, userInfo.id, userInfo.username);
    console.log('setting user session cookies');
    cookies().set('sessionId', sessionId);
    cookies().set('accId', userInfo.id);
    cookies().set('username', userInfo.username);
    console.log('session cookies are set');
}

export async function getSessionId() {
    return cookies().get('sessionId')?.value;
}

export async function tmdbLogOut(sessionId: string) {
    console.log('logging out...');
    console.log(sessionId);
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            session_id: sessionId,
        }),
    };

    let res = await fetch(
        'https://api.themoviedb.org/3/authentication/session',
        options
    );

    if (!res.ok) {
        console.error('failed to log out');
    } else {
        console.log('successfully logged out');
    }

    return await res.json();
}

export async function createTmdbSession(rt: string) {
    //create new options object for fetching session_id using request token
    const sessionOptions: RequestInit = {
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

    const sessionRes = await fetch(
        'https://api.themoviedb.org/3/authentication/session/new',
        sessionOptions
    );

    if (!sessionRes.ok) {
        const sessionResJson = await sessionRes.json();
        console.log(sessionResJson);
        console.error('failed to get session id');
        return sessionResJson;
    } else {
        const sessionResJson = await sessionRes.json();
        console.log(sessionResJson);
        console.log('successfully got a session id');
        return sessionResJson;
    }
}

export async function deleteCookies() {
    console.log(`deleting cookies`);
    cookies().delete('accId');
    cookies().delete('reqToken');
    cookies().delete('sessionId');
    return cookies().delete('username');
}

export async function getContentAccountInfo(
    sessionId: string,
    content: string,
    contentId: number,
    seasonNum?: string,
    episodeNum?: string
) {
    let res;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    if (seasonNum && episodeNum) {
        res = await fetch(
            `https://api.themoviedb.org/3/${content}/${contentId}/season/${seasonNum}/episode/${episodeNum}/account_states?session_id=${sessionId}`,
            options
        );
    } else {
        res = await fetch(
            `https://api.themoviedb.org/3/${content}/${contentId}/account_states?session_id=${sessionId}`,
            options
        );
    }

    if (!res.ok) {
        console.error('failed to get content account info');
    } else {
        console.log('successfully got content account info');
    }

    return await res.json();
}

export async function getUserInfo(sessionId: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/account/account_id?session_id=${sessionId}`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch account info');
    }
    const userInfo = await res.json();
    console.log(userInfo);
    return userInfo;
}

export async function getContent(
    content: string,
    cat: string | undefined,
    pageNum: number
) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    console.log(content, cat, pageNum);
    if (content === 'trending') {
        if (cat === 'movies') cat = 'movie';
        if (cat === 'people') cat = 'person';
    }

    let res = await fetch(
        `https://api.themoviedb.org/3/${content}/${cat}${content === 'trending' ? '/day' : ''}?language=en-US&page=${pageNum}`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch content');
    } else {
        console.log('successfully retrieved content');
    }
    let result = await res.json();
    return result;
}

export async function getFavorWatchRated(
    sessionId: string,
    whichOne: string,
    accountId: string,
    content: string
) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    if (content === 'movie') content = 'movies';

    console.log(whichOne, content);

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/${whichOne}/${content}?session_id=${sessionId}&language=en-US&page=1&sort_by=created_at.asc`,
        options
    );

    let favorWatch = await res.json();
    if (!res.ok) {
        console.log(favorWatch);
        console.error(`failed to fetch ${whichOne} ${content}`);
    }
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

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/${whichOne}?session_id=${sessionId}`,
        options
    );

    if (!res.ok) {
        console.log(`failed to add ${type} to ${whichOne}`);
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

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/${whichOne}?session_id=${sessionId}`,
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
