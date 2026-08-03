import BackButton from '@/app/components/BackButton';
import SearchResults from '../../components/Search/SearchResults';
import SearchResNav from '@/app/components/Search/SearchResNav';
import SearchBar from '@/app/components/Search/SearchBar';
import { Suspense } from 'react';
import { fetchTmdb } from '@/app/lib/tmdb';

export default async function Search({
    params,
    searchParams,
}: {
    params: Promise<{ content: string }>;
    searchParams: Promise<{ query: string; page: string }>;
}) {
    const { query, page } = await searchParams;
    let { content } = await params;

    let keyword = false;
    let genre = false;

    let theKeyword;
    let theGenre;

    if (content.includes('keyword')) {
        content = content.split('-')[1];
        keyword = true;
        theKeyword = query.split('--')[1];
    } else if (content.includes('genre')) {
        content = content.split('-')[1];
        genre = true;
        theGenre = query.split('--')[1];
    }

    let movies;
    let shows;
    let people;
    let all;

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

    if (genre) {
        [movies, shows] = await Promise.all([
            fetchTmdb(
                `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${query.split('--')[0]}`,
                options,
                'genre movie search'
            ),
            fetchTmdb(
                `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${query.split('--')[0]}`,
                options,
                'genre tv search'
            ),
        ]);
    } else if (keyword) {
        [movies, shows] = await Promise.all([
            fetchTmdb(
                `https://api.themoviedb.org/3/discover/movie?with_keywords=${query.split('--')[0]}&include_adult=false&sort_by=popularity.desc&language=en-US&page=${page}`,
                options,
                'keyword movie search'
            ),
            fetchTmdb(
                `https://api.themoviedb.org/3/discover/tv?with_keywords=${query.split('--')[0]}&include_adult=false&sort_by=popularity.desc&language=en-US&page=${page}`,
                options,
                'keyword tv search'
            ),
        ]);
    } else {
        [movies, shows, people, all] = await Promise.all([
            fetchTmdb(
                `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
                options,
                'movie search'
            ),
            fetchTmdb(
                `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
                options,
                'tv search'
            ),
            fetchTmdb(
                `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
                options,
                'person search'
            ),
            fetchTmdb(
                `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
                options,
                'multi search'
            ),
        ]);
    }

    let peopleLength;
    let allLength;

    if (people && all) {
        peopleLength = people.total_results;
        allLength = all.total_results;
    }

    const movieLength = movies.total_results;
    const tvLength = shows.total_results;
    let data;

    if (content === 'movie') {
        data = movies;
    } else if (content === 'tv') {
        data = shows;
    } else if (content === 'person') {
        data = people;
    } else {
        data = all;
    }

    const lengths = {
        movie: movieLength,
        tv: tvLength,
        people: peopleLength,
        all: allLength,
    };

    return (
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <BackButton main={false} />
            <div>
                <h1 className="text-2xl sm:text-5xl flex tracking-wider items-end font-light mb-2 gap-2">
                    {keyword && (
                        <>
                            <div className="font-light">Keyword:</div>{' '}
                            <div className="text-xl sm:text-4xl italic">
                                {theKeyword}
                            </div>
                        </>
                    )}
                    {genre && (
                        <>
                            <div className="font-light">Genre:</div>
                            <div className="text-xl sm:text-4xl italic">
                                {theGenre}
                            </div>
                        </>
                    )}
                    {!keyword && !genre && `Search results for: ${query}`}
                </h1>
                <div className="w-[80%] max-w-full h-px bg-brand-blue"></div>
            </div>
            <SearchBar />
            <div className="flex sm:flex-row gap-4 flex-col">
                <SearchResNav
                    keyword={theKeyword || undefined}
                    genre={theGenre || undefined}
                    query={query}
                    lengths={lengths}
                />
                <Suspense fallback={<p>Loading content...</p>}>
                    <SearchResults
                        keyword={theKeyword || undefined}
                        genre={theGenre || undefined}
                        query={query}
                        cat={content}
                        data={data.results}
                        lengths={lengths}
                    />
                </Suspense>
            </div>
        </main>
    );
}
