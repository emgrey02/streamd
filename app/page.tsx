import { Suspense } from 'react';
import ContentList from './components/ContentList';
import SearchBar from './components/SearchBar';

export default async function Home() {
    const trendingCats: string[] = ['all', 'movie', 'tv', 'person'];

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

    // trending

    const allTrending = await fetch(
        `https://api.themoviedb.org/3/trending/${trendingCats[0]}/day?language=en-US&page=1`,
        options
    );

    const movieTrending = await fetch(
        `https://api.themoviedb.org/3/trending/${trendingCats[1]}/day?language=en-US&page=1`,
        options
    );

    const tvTrending = await fetch(
        `https://api.themoviedb.org/3/trending/${trendingCats[2]}/day?language=en-US&page=1`,
        options
    );

    const pplTrending = await fetch(
        `https://api.themoviedb.org/3/trending/${trendingCats[3]}/day?language=en-US&page=1`,
        options
    );

    // movies

    const movieCats: string[] = [
        'now_playing',
        'popular',
        'top_rated',
        'upcoming',
    ];

    const nowPlayingMovies = await fetch(
        `https://api.themoviedb.org/3/movie/${movieCats[0]}?language=en-US&page=1`,
        options
    );

    const popularMovies = await fetch(
        `https://api.themoviedb.org/3/movie/${movieCats[1]}?language=en-US&page=1`,
        options
    );
    const topRatedMovies = await fetch(
        `https://api.themoviedb.org/3/movie/${movieCats[2]}?language=en-US&page=1`,
        options
    );
    const upcomingMovies = await fetch(
        `https://api.themoviedb.org/3/movie/${movieCats[3]}?language=en-US&page=1`,
        options
    );

    // tv

    const showCats: string[] = [
        'airing_today',
        'on_the_air',
        'popular',
        'top_rated',
    ];

    const airingTodayShows = await fetch(
        `https://api.themoviedb.org/3/tv/${showCats[0]}?language=en-US&page=1`,
        options
    );

    const onAirShows = await fetch(
        `https://api.themoviedb.org/3/tv/${showCats[1]}?language=en-US&page=1`,
        options
    );

    const popularShows = await fetch(
        `https://api.themoviedb.org/3/tv/${showCats[2]}?language=en-US&page=1`,
        options
    );

    const topRatedShows = await fetch(
        `https://api.themoviedb.org/3/tv/${showCats[3]}?language=en-US&page=1`,
        options
    );

    const trendingData: ContentItem[][] = [
        await allTrending.json().then((res) => res.results),
        await movieTrending.json().then((res) => res.results),
        await tvTrending.json().then((res) => res.results),
        await pplTrending.json().then((res) => res.results),
    ];

    const moviesData: ContentItem[][] = [
        await nowPlayingMovies.json().then((res) => res.results),
        await popularMovies.json().then((res) => res.results),
        await topRatedMovies.json().then((res) => res.results),
        await upcomingMovies.json().then((res) => res.results),
    ];

    const showsData: ContentItem[][] = [
        await airingTodayShows.json().then((res) => res.results),
        await onAirShows.json().then((res) => res.results),
        await popularShows.json().then((res) => res.results),
        await topRatedShows.json().then((res) => res.results),
    ];

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
