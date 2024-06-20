'use server';

export async function getMovies(cat: String | null, pageNum: Number) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/movie/${cat}?language=en-US&page=${pageNum}`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movies');
    }

    return await res.json();
}

export async function addToFavorites(movieId: string, accountId: string) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            media_type: 'movie',
            media_id: +movieId,
            favorite: true,
        }),
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/favorite`,
        options
    );

    if (!res.ok) {
        console.error('failed to favorite movie');
    }

    return;
}

export async function getFavorites(accountId: string | unknown) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch favorite movies');
    }

    let favorites = await res.json();
    return favorites.results;
}

export async function removeFavorite(movieId: string, accountId: string) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            media_type: 'movie',
            media_id: +movieId,
            favorite: false,
        }),
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/favorite`,
        options
    );

    if (!res.ok) {
        console.error('failed to favorite movie');
    }

    return;
}
