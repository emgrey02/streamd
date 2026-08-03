export class TmdbError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'TmdbError';
        this.status = status;
    }
}

// Fetches from TMDB and throws TmdbError on a non-2xx response instead of
// letting callers silently render whatever error body TMDB sent back.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchTmdb<T = any>(
    url: string,
    options: RequestInit,
    context: string
): Promise<T> {
    const res = await fetch(url, options);

    if (!res.ok) {
        console.error(`${context} failed: ${res.status} ${res.statusText}`);
        throw new TmdbError(`${context} failed`, res.status);
    }

    return res.json() as Promise<T>;
}

// Fetches every page of a paginated TMDB list endpoint and concatenates the results.
export async function fetchAllTmdbPages<T>(
    urlForPage: (page: number) => string,
    options: RequestInit,
    context: string
): Promise<T[]> {
    const first = await fetchTmdb<{ results: T[]; total_pages: number }>(
        urlForPage(1),
        options,
        context
    );

    let results = first.results;

    for (let page = 2; page <= first.total_pages; page++) {
        const next = await fetchTmdb<{ results: T[] }>(
            urlForPage(page),
            options,
            context
        );
        results = results.concat(next.results);
    }

    return results;
}
