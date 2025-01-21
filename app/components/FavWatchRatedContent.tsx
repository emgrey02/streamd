'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getFavorWatchRated } from '../actions';
import { useRouter } from 'next/navigation';

export default function FavWatchRatedContent(props: {
    category: string;
    sessionId: string;
    accountId: string;
}) {
    const category = props.category;
    const sessionId = props.sessionId;
    const accountId = props.accountId;
    const router = useRouter();

    const [movieList, setMovieList] = useState<any>();
    const [tvList, setTvList] = useState<any>();
    const [message, setMessage] = useState('');
    const [tvVersion, setTvVersion] = useState('image');
    const [movieVersion, setMovieVersion] = useState('image');
    const [shownMoviePageNumbers, setShownMoviePageNumbers] = useState(1);
    const [shownTvPageNumbers, setShownTvPageNumbers] = useState(1);
    const [moviePages, setMoviePages] = useState(1);
    const [tvPages, setTvPages] = useState(1);

    useEffect(() => {
        const getContent = async () => {
            const movies = await getFavorWatchRated(
                sessionId,
                category,
                accountId,
                'movies',
                1
            );
            const shows = await getFavorWatchRated(
                sessionId,
                category,
                accountId,
                'tv',
                1
            );
            setMoviePages(movies.total_pages);
            setTvPages(shows.total_pages);
            setMovieList(movies.results);
            setTvList(shows.results);

            if (category === 'favorite') {
                localStorage.setItem('dashCat', category);
                setMessage(`Favorite some content!`);
            } else if (category === 'watchlist') {
                localStorage.setItem('dashCat', category);
                setMessage(`Add some content to your Watchlist!`);
            } else if (category === 'rated') {
                localStorage.setItem('dashCat', category);
                setMessage(`Rate some content!`);
            }
        };
        getContent();
    }, [category, sessionId, accountId]);

    const loadMoreContent = (e: any) => {
        const type = e.target.id;

        const load = async () => {
            let content;
            if (type === 'tv') {
                content = await getFavorWatchRated(
                    sessionId,
                    category,
                    accountId,
                    type,
                    shownTvPageNumbers + 1
                );
                setTvList(tvList.concat(content.results));
                setShownTvPageNumbers(shownTvPageNumbers + 1);
            } else {
                content = await getFavorWatchRated(
                    sessionId,
                    category,
                    accountId,
                    type,
                    shownMoviePageNumbers + 1
                );
                setMovieList(movieList.concat(content.results));
                setShownMoviePageNumbers(shownMoviePageNumbers + 1);
            }
        };
        load();
    };

    return (
        <>
            {movieList && (
                <div className="flex flex-col gap-2 relative">
                    <h2 className="text-xl">movies</h2>
                    <ul
                        className={`${movieVersion === 'image' ? 'grid grid-cols-[repeat(auto-fill,_42cqw)] sm:grid-cols-[repeat(auto-fill,_30cqw)] lg:grid-cols-[repeat(auto-fill,_15cqw)] place-items-center' : 'flex flex-col gap-2 gap-y-1 flex-wrap max-h-80 '} bg-slate-900 p-4 w-full relative py-4 pb-12 overflow-x-scroll`}
                    >
                        {movieList.map((movie: any, index: number) => (
                            <li
                                className="hover:bg-brand-blue p-1 hover:text-slate-950 text-wrap max-w-60"
                                key={index}
                            >
                                <button
                                    className="focus:outline-none focus:ring focus:ring-brand-blue w-full text-start"
                                    onClick={() =>
                                        router.push(
                                            `/movie/${movie.id.toString()}`
                                        )
                                    }
                                >
                                    {movieVersion === 'text' ?
                                        <div>{movie.title}</div>
                                    :   <>
                                            {movie.poster_path ?
                                                <Image
                                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                    alt={`Poster for ${movie.title}`}
                                                    width={300}
                                                    height={120}
                                                    className="min-w-full"
                                                    title={movie.title}
                                                />
                                            :   <div className="w-[80px] h-[120px] bg-slate-300/20 grid place-items-center">
                                                    movie poster unavailable
                                                </div>
                                            }
                                        </>
                                    }
                                </button>
                            </li>
                        ))}
                        {movieList.length > 0 || (
                            <p className="absolute top-0 grid w-full h-full place-items-center">
                                {message}
                            </p>
                        )}
                        {moviePages > shownMoviePageNumbers && (
                            <button
                                id="movie"
                                className={`w-max h-min p-2 outline-2 outline-brand-blue outline hover:bg-slate-700`}
                                onClick={loadMoreContent}
                            >
                                Load More
                            </button>
                        )}
                    </ul>

                    {movieList.length > 0 && (
                        <button
                            onClick={() =>
                                setMovieVersion(
                                    movieVersion === 'text' ? 'image' : 'text'
                                )
                            }
                            className="absolute bottom-0 right-0 pe-4 pb-4 underline underline-offset-2 text-slate-400 hover:text-slate-300"
                        >
                            {movieVersion === 'text' ?
                                'image version'
                            :   'text version'}
                        </button>
                    )}
                </div>
            )}
            {tvList && (
                <div className="flex flex-col gap-2 relative">
                    <h2 className="text-xl">tv shows</h2>
                    <ul
                        className={`${tvVersion === 'image' ? 'grid grid-cols-[repeat(auto-fill,_42cqw)] sm:grid-cols-[repeat(auto-fill,_30cqw)] lg:grid-cols-[repeat(auto-fill,_15cqw)] place-items-center' : 'flex flex-col gap-2 gap-y-1 flex-wrap max-h-80 '} bg-slate-900 p-4 w-full relative py-4 pb-12 overflow-x-scroll`}
                    >
                        {tvList.map((show: any, index: number) => (
                            <li
                                className="hover:bg-brand-blue p-1 hover:text-slate-950 text-wrap max-w-60"
                                key={index}
                            >
                                <button
                                    className="focus:outline-none focus:ring focus:ring-brand-blue w-full text-start"
                                    onClick={() =>
                                        router.push(`/tv/${show.id.toString()}`)
                                    }
                                >
                                    {tvVersion === 'text' ?
                                        <div>{show.name}</div>
                                    :   <>
                                            {show.poster_path ?
                                                <Image
                                                    src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                                                    alt={`Poster for ${show.name}`}
                                                    width={300}
                                                    height={120}
                                                    className="min-w-full"
                                                    title={show.name}
                                                />
                                            :   <div
                                                    title={show.name}
                                                    className="w-[80px] h-[120px] bg-slate-300/20 grid place-items-center"
                                                >
                                                    movie poster unavailable
                                                </div>
                                            }
                                        </>
                                    }
                                </button>
                            </li>
                        ))}
                        {tvList.length > 0 || (
                            <p className="absolute top-0 grid w-full h-full place-items-center">
                                {message}
                            </p>
                        )}
                        {tvPages > shownTvPageNumbers && (
                            <button
                                id="tv"
                                className="w-min"
                                onClick={loadMoreContent}
                            >
                                Load More
                            </button>
                        )}
                    </ul>
                    {tvList.length > 0 && (
                        <button
                            onClick={() =>
                                setTvVersion(
                                    tvVersion === 'text' ? 'image' : 'text'
                                )
                            }
                            className="absolute bottom-0 right-0 pe-4 pb-4 underline underline-offset-2 text-slate-400 hover:text-slate-300"
                        >
                            {tvVersion === 'text' ?
                                'image version'
                            :   'text version'}
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
