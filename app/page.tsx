import { Suspense } from 'react';
import ContentList from './components/Home/ContentList';
import SearchBar from './components/Search/SearchBar';
import { fetchTmdb } from './lib/tmdb';

type TmdbListResponse = { results: ContentItem[] };

export default async function Home() {
    const trendingCats: string[] = ['all', 'movie', 'tv', 'person'];

    // revalidate once a day
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        next: {
            revalidate: 86400,
        },
    };

    const movieCats: string[] = [
        'now_playing',
        'popular',
        'top_rated',
        'upcoming',
    ];

    const showCats: string[] = [
        'airing_today',
        'on_the_air',
        'popular',
        'top_rated',
    ];

    const fetchList = (url: string, context: string) =>
        fetchTmdb<TmdbListResponse>(url, options, context).then(
            (res) => res.results
        );

    const [trendingData, moviesData, showsData] = await Promise.all([
        Promise.all(
            trendingCats.map((cat) =>
                fetchList(
                    `https://api.themoviedb.org/3/trending/${cat}/day?language=en-US&page=1`,
                    `fetch ${cat} trending`
                )
            )
        ),
        Promise.all(
            movieCats.map((cat) =>
                fetchList(
                    `https://api.themoviedb.org/3/movie/${cat}?language=en-US&page=1`,
                    `fetch ${cat} movies`
                )
            )
        ),
        Promise.all(
            showCats.map((cat) =>
                fetchList(
                    `https://api.themoviedb.org/3/tv/${cat}?language=en-US&page=1`,
                    `fetch ${cat} shows`
                )
            )
        ),
    ]);

    return (
        <main className="min-h-screen px-2 sm:px-4 flex flex-col gap-10 pb-10">
            <SearchBar />
            <Suspense fallback={<p>Loading...</p>}>
                <ContentList
                    title="trending"
                    content={trendingData}
                    cat={trendingCats}
                />
            </Suspense>
            <Suspense fallback={<p>Loading...</p>}>
                <ContentList
                    title="movie"
                    content={moviesData}
                    cat={movieCats}
                />
            </Suspense>
            <Suspense fallback={<p>Loading...</p>}>
                <ContentList title="tv" content={showsData} cat={showCats} />
            </Suspense>
        </main>
    );
}
