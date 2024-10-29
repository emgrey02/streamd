'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Lists from './Lists';
import DashNav from './DashNav';
import { getFavorWatchRated } from '../actions';

type Props = {
    accountId?: string;
    sessionId?: string;
    accessToken?: string;
    accountObjectId?: string;
};

export default function DashContent({
    accessToken,
    accountObjectId,
    sessionId,
    accountId,
}: Props) {
    const router = useRouter();
    const [tvVersion, setTvVersion] = useState('image');
    const [movieVersion, setMovieVersion] = useState('image');
    const [category, setCategory] = useState<string>();
    const [message, setMessage] = useState('');
    const [movieList, setMovieList] = useState<any>();
    const [tvList, setTvList] = useState<any>();

    useEffect(() => {
        async function retrieveContent() {
            if (category) {
                localStorage.setItem('dashCat', category);
            }
            if (accountId && sessionId) {
                setCategory(localStorage.getItem('dashCat') || 'favorite');

                if (category === 'favorite') {
                    let favoriteMovies = await getFavorWatchRated(
                        sessionId,
                        category,
                        accountId,
                        'movies'
                    );
                    let favoriteTv = await getFavorWatchRated(
                        sessionId,
                        category,
                        accountId,
                        'tv'
                    );
                    localStorage.setItem('dashCat', category);
                    setMovieList(favoriteMovies);
                    setTvList(favoriteTv);
                    setMessage(`Favorite some content!`);
                } else if (category === 'watchlist') {
                    let movieWatchlist = await getFavorWatchRated(
                        sessionId,
                        category,
                        accountId,
                        'movies'
                    );
                    let tvWatchlist = await getFavorWatchRated(
                        sessionId,
                        category,
                        accountId,
                        'tv'
                    );
                    localStorage.setItem('dashCat', category);
                    setMovieList(movieWatchlist);
                    setTvList(tvWatchlist);
                    setMessage(`Add some content to your Watchlist!`);
                } else if (category === 'rated') {
                    let ratedMovies = await getFavorWatchRated(
                        sessionId,
                        category,
                        accountId,
                        'movies'
                    );
                    let ratedTv = await getFavorWatchRated(
                        sessionId,
                        category,
                        accountId,
                        'tv'
                    );

                    localStorage.setItem('dashCat', category);
                    setMovieList(ratedMovies);
                    setTvList(ratedTv);
                    setMessage(`Rate some content!`);
                }
            }
        }
        retrieveContent();
    }, [sessionId, accountId, category, accountObjectId]);

    return (
        <div className="flex flex-col gap-4">
            <DashNav cat={category || ''} setCat={setCategory} />
            {movieList && category !== 'lists' && (
                <div className="flex flex-col gap-2 relative">
                    <h2 className="text-xl">movies</h2>
                    <ul
                        className={`${movieVersion === 'image' ? 'grid grid-cols-[repeat(auto-fill,_17vw)] sm:grid-cols-[repeat(auto-fill,_10vw)] lg:grid-cols-[repeat(auto-fill,_8vw)] place-items-center' : 'flex flex-col gap-2 gap-y-1 flex-wrap max-h-80 '} bg-slate-900 p-4 w-full relative py-4 pb-12 overflow-x-scroll`}
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
                                                    width={80}
                                                    height={120}
                                                    className="max-w-full"
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
            {tvList && category !== 'lists' && (
                <div className="flex flex-col gap-1 relative">
                    <h2 className="text-xl">tv shows</h2>
                    <ul
                        className={`${tvVersion === 'image' ? 'grid grid-cols-[repeat(auto-fill,_17vw)] sm:grid-cols-[repeat(auto-fill,_10vw)] lg:grid-cols-[repeat(auto-fill,_8vw)] place-items-center' : 'flex flex-col flex-wrap gap-2 gap-y-1 max-h-80 '} bg-slate-900 p-4 w-full relative py-4 pb-12 overflow-x-scroll`}
                    >
                        {tvList.map((show: any, index: number) => (
                            <li
                                className="hover:bg-brand-blue p-1 hover:text-slate-950"
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
                                                    width={80}
                                                    height={120}
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
            {category == 'lists' && (
                <Lists
                    accessToken={accessToken}
                    accountObjectId={accountObjectId}
                />
            )}
        </div>
    );
}
