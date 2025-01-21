'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

//movie,tv,people info

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
        console.log(`successfully retrieved ${content} content`);
    }
    let result = await res.json();
    return result;
}

export async function searchForContent(search: string, pageNum: number) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    console.log(search);

    const tvRes = await fetch(
        `https://api.themoviedb.org/3/search/tv?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${pageNum}`,
        options
    );

    const movieRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${pageNum}`,
        options
    );

    if (!movieRes.ok) {
        console.error('failed to get movie search results');
    } else {
        console.log('successfully retrieved movie search results');
    }

    if (!tvRes.ok) {
        console.error('failed to get tv search results');
    } else {
        console.log('successfully retrieved tv search results');
    }

    let movieResult = await movieRes.json();
    let tvResult = await tvRes.json();

    console.log(movieResult, tvResult);

    movieResult.results.forEach((r: any) => {
        r.media_type = 'movie';
    });

    tvResult.results.forEach((r: any) => {
        r.media_type = 'tv';
    });

    let finalArray = [];

    for (let i = 0; i < 20; i++) {
        finalArray.push(movieResult.results[i]);
        finalArray.push(tvResult.results[i]);
    }

    console.log(finalArray);

    return finalArray;
}

export async function doASearch(search: string, type: string, page: number) {
    // type can be movie, tv, person, multi

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/search/${type}?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
        options
    );
    const results = await res.json();

    if (!res.ok) {
        console.log(results);
        console.error(`unable to do a ${type} search`);
    }

    return results;
}

export async function keywordSearch(
    search: string,
    type: string,
    page: string
) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/discover/${type}?with_keywords=${search.split('--')[0]}&include_adult=false&sort_by=popularity.desc&language=en-US&page=${page}`,
        options
    );

    const results = await res.json();

    if (!res.ok) {
        console.log(results);
        console.error(`unable to do keyword ${type} search`);
    }

    return results;
}

export async function genreSearch(search: string, type: string, page: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/discover/${type}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${search.split('--')[0]}'`,
        options
    );

    const results = await res.json();
    console.log(results);

    if (!res.ok) {
        console.log(results);
        console.error(`unable to do genre ${type} search`);
    }

    return results;
}

//account log-in and log-out tasks
export async function getRequestToken() {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        next: { revalidate: 60 },
        body: JSON.stringify({
            redirect_to: `${process.env.NEXT_PUBLIC_BASE_URL}/approval`,
        }),
    };

    options.next as RequestInit;

    //fetch to get a request token from TMDB
    const res = await fetch(
        'https://api.themoviedb.org/4/auth/request_token',
        options
    );

    //error handling
    if (!res.ok) {
        console.error('failed to fetch v4 request token from tmdb');
    }

    //assign request Token
    const resJson = await res.json();

    const reqToken = resJson.request_token;

    console.log('successfully got request token from tmdb');
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
    userInfo: { id: string; username: string },
    accessToken: string,
    accountObjectId: string
) {
    console.log(sessionId, accessToken, userInfo.id, userInfo.username);
    console.log('setting user session cookies');
    cookies().set('sessionId', sessionId);
    cookies().set('accId', userInfo.id);
    cookies().set('username', userInfo.username);
    cookies().set('accessToken', accessToken);
    cookies().set('accountObjectId', accountObjectId);
    console.log('session cookies are set');
}

export async function getSessionId() {
    return cookies().get('sessionId')?.value;
}

export async function getAccessToken() {
    return cookies().get('accessToken')?.value;
}

export async function tmdbLogOut(accessToken: string) {
    console.log('logging out...');
    console.log(accessToken);

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
        console.log(accessTokenResJson);
        console.error('failed to get accessToken');
    } else {
        console.log(accessTokenResJson);
        console.log('successfully got an accessToken');

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
            console.log(sessionRes);
            console.error('failed to get session id from v4 access token');
        }
        console.log('successfully got a session id');
        const sessionResJson = await sessionRes.json();

        return { session: sessionResJson, access: accessTokenResJson };
    }
}

export async function deleteCookies() {
    console.log(`deleting cookies`);
    cookies().delete('accId');
    cookies().delete('reqToken');
    cookies().delete('sessionId');
    cookies().delete('accessToken');
    cookies().delete('accountObjectId');
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

//favorite, add to watchlist, rate

interface body {
    media_type: string;
    media_id: number;
    favorite?: boolean;
    watchlist?: boolean;
}

export async function getFavorWatchRated(
    sessionId: string,
    whichOne: string,
    accountId: string,
    content: string,
    pageNum: number
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
        `https://api.themoviedb.org/3/account/${accountId}/${whichOne}/${content}?session_id=${sessionId}&language=en-US&page=${pageNum}&sort_by=created_at.asc`,
        options
    );

    let favorWatch = await res.json();
    if (!res.ok) {
        console.log(favorWatch);
        console.error(`failed to fetch ${whichOne} ${content}`);
    }
    // console.log(favorWatch);
    return favorWatch;
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

//list utilities
export async function getLists(accountObjectId: string, pageNum: number) {
    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'no-cache',
    };

    let res = await fetch(
        `https://api.themoviedb.org/4/account/${accountObjectId}/lists?page=${pageNum}`,
        options
    );

    let lists = await res.json();

    if (!res.ok) {
        console.log(lists);
        console.error(`failed to fetch lists`);
    }

    return lists.results;
}

export async function createList(at: string, formData: FormData) {
    const rawFormData = {
        name: formData.get('list name'),
        description: formData.get('list description'),
        public: formData.get('public toggle'),
    };

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            description: rawFormData.description,
            name: rawFormData.name,
            iso_3166_1: 'US',
            iso_639_1: 'en',
            public: !rawFormData.public ? 'false' : 'true',
        }),
    };

    let res = await fetch('https://api.themoviedb.org/4/list', options);
    let resJson = await res.json();

    console.log(resJson);

    if (!res.ok) {
        console.log(res);
        console.error(`failed to create list`);
    } else {
        console.log('successfuly created list');
    }

    revalidatePath('/dashboard', 'page');
}

export async function updateList(at: string, id: string, formData: FormData) {
    const rawFormData = {
        name: formData.get('list name'),
        description: formData.get('list description'),
        public: formData.get('public toggle'),
    };

    console.log(rawFormData);
    console.log(at);

    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            description: rawFormData.description,
            name: rawFormData.name,
            public: !rawFormData.public ? false : true,
            sort_by: 'original_order.asc',
        }),
    };

    let res = await fetch(`https://api.themoviedb.org/4/list/${id}`, options);
    let resJson = await res.json();

    console.log(resJson);

    if (!res.ok) {
        console.log(res);
        console.error(`failed to update list`);
    } else {
        console.log('successfuly updated list');
    }

    revalidatePath('/dashboard', 'page');
}

export async function deleteList(at: string, listId: string) {
    console.log(at);

    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${at}`,
        },
    };

    console.log(listId);

    let res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}`,
        options
    );
    let resJson = await res.json();

    if (!res.ok) {
        console.log(resJson);
        console.error(`failed to delete list`);
    } else {
        console.log('successfuly deleted list');
    }

    revalidatePath('/dashboard', 'page');
}

export async function AddToList(
    at: string,
    listId: string,
    mt: string,
    mi: number
) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            items: [{ media_type: mt, media_id: mi }],
        }),
    };

    let res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}/items`,
        options
    );
    let resJson = await res.json();

    if (!res.ok) {
        console.log(resJson);
        console.error(`failed to add item to list`);
    } else {
        console.log('successfuly added item to list');
    }

    revalidatePath('/dashboard/list/[id]', 'page');
    revalidatePath('/tv/[id]', 'layout');
    revalidatePath('/movie/[id]', 'layout');

    return resJson;
}

export async function deleteListItem(
    at: string,
    listId: string,
    mt: string,
    mi: number
) {
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            items: [{ media_type: mt, media_id: mi }],
        }),
    };

    let res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}/items`,
        options
    );
    let resJson = await res.json();

    if (!res.ok) {
        console.log(resJson);
        console.error(`failed to delete item from list`);
    } else {
        console.log('successfuly added item to list');
    }

    revalidatePath('/dashboard/list/[id]', 'page');

    return resJson;
}

export async function addNote(
    at: string,
    listId: string,
    mt: string,
    mi: number,
    formData: FormData
) {
    const rawFormData = {
        note: formData.get('note'),
    };

    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${at}`,
        },
        body: JSON.stringify({
            items: [
                { media_type: mt, media_id: mi, comment: rawFormData.note },
            ],
        }),
    };

    let res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}/items`,
        options
    );
    let resJson = await res.json();

    if (!res.ok) {
        console.log(resJson);
        console.error(`failed to add note`);
    } else {
        console.log('successfuly added note');
    }

    revalidatePath('/dashboard/list/[id]', 'page');
}

export async function getItemStatus(
    at: string,
    listId: string,
    mt: string,
    mi: number
) {
    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${at}`,
        },
        cache: 'no-cache',
    };

    let res = await fetch(
        `https://api.themoviedb.org/4/list/${listId}/item_status?media_id=${mi}&media_type=${mt}`,
        options
    );

    let status = await res.json();

    if (!status.success) {
        console.log(`item is not on list ${listId}`);
        return false;
    } else {
        console.log(`item is on list ${listId}`);
        return true;
    }
}
