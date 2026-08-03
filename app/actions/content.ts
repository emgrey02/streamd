'use server';
import { fetchTmdb } from '../lib/tmdb';

//movie,tv,people info

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

    const result = await fetchTmdb(
        `https://api.themoviedb.org/3/${content}/${cat}${content === 'trending' ? '/day' : ''}?language=en-US&page=${pageNum}`,
        options,
        `fetch ${content} content`
    );
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

    const [tvResult, movieResult] = await Promise.all([
        fetchTmdb<{ results: ContentItem[] }>(
            `https://api.themoviedb.org/3/search/tv?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${pageNum}`,
            options,
            'tv search'
        ),
        fetchTmdb<{ results: ContentItem[] }>(
            `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${pageNum}`,
            options,
            'movie search'
        ),
    ]);

    movieResult.results.forEach((r: ContentItem) => {
        r.media_type = 'movie';
    });

    tvResult.results.forEach((r: ContentItem) => {
        r.media_type = 'tv';
    });

    const finalArray = [];

    for (let i = 0; i < 20; i++) {
        finalArray.push(movieResult.results[i]);
        finalArray.push(tvResult.results[i]);
    }

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

    return fetchTmdb(
        `https://api.themoviedb.org/3/search/${type}?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
        options,
        `${type} search`
    );
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

    return fetchTmdb(
        `https://api.themoviedb.org/3/discover/${type}?with_keywords=${search.split('--')[0]}&include_adult=false&sort_by=popularity.desc&language=en-US&page=${page}`,
        options,
        `keyword ${type} search`
    );
}

export async function genreSearch(search: string, type: string, page: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    return fetchTmdb(
        `https://api.themoviedb.org/3/discover/${type}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${search.split('--')[0]}`,
        options,
        `genre ${type} search`
    );
}
