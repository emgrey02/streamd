'use client';

import { useEffect, useState, useRef } from 'react';
import { getFavorWatchRated } from '@/app/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
    sessionId?: string;
    accountId?: string;
};

export default function DashContent({ sessionId, accountId }: Props) {
    const router = useRouter();
    const categories = ['favorite', 'watchlist', 'rated', 'lists'];
    const [category, setCategory] = useState(categories[0]);
    const [message, setMessage] = useState('');
    const [movieList, setMovieList] = useState<any>();
    const [tvList, setTvList] = useState<any>();

    useEffect(() => {
        async function retrieveContent() {
            if (accountId && sessionId) {
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
                    setCategory('favorite');
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
                    setCategory('watchlist');
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
                    setCategory(category);
                    setMovieList(ratedMovies);
                    setTvList(ratedTv);
                    setMessage(`Rate some content!`);
                }
            }
        }
        retrieveContent();
    }, [sessionId, accountId, category]);

    console.log(movieList);

    return (
        <div>
            <ul className="w-fit grid grid-cols-4 items-start place-items-stretch mb-4">
                <li>
                    <button
                        className={`${category === 'favorite' && 'bg-slate-900'} ps-2 pe-8 hover:bg-slate-600 w-full py-2 text-start`}
                        onClick={() => setCategory('favorite')}
                    >
                        favorites
                    </button>
                </li>
                <li>
                    <button
                        className={`${category === 'watchlist' && 'bg-slate-900'} ps-2 pe-8 hover:bg-slate-600 w-full py-2 text-start`}
                        onClick={() => setCategory('watchlist')}
                    >
                        watchlist
                    </button>
                </li>
                <li>
                    <button
                        className={`${category === 'rated' && 'bg-slate-900'} ps-2 pe-8 hover:bg-slate-600 w-full py-2 text-start`}
                        onClick={() => setCategory('rated')}
                    >
                        rated
                    </button>
                </li>
                <li>
                    <button
                        className={`${category === 'lists' && 'bg-slate-900'} ps-2 pe-8 hover:bg-slate-600 w-full py-2 text-start`}
                        onClick={() => setCategory('lists')}
                    >
                        your lists
                    </button>
                </li>
            </ul>
            {movieList && (
                <>
                    <h2>movies</h2>
                    <ul className="grid grid-cols-[repeat(auto-fill,_10vw)] md:grid-cols-[repeat(auto-fill,_7vw)] gap-2 xl:grid-cols-[repeat(auto-fill,_6vw)] 2xl:grid-cols-[repeat(auto-fill,_4vw)] bg-slate-900 p-4 place-items-start w-full relative py-8">
                        {movieList.map((movie: any, index: number) => (
                            <li className="hover:bg-brand-blue p-1" key={index}>
                                <button
                                    className="focus:outline-none focus:ring focus:ring-brand-blue"
                                    onClick={() =>
                                        router.push(
                                            `/movie/${movie.id.toString()}`
                                        )
                                    }
                                >
                                    {movie.poster_path ?
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={`Poster for ${movie.title}`}
                                            width={80}
                                            height={120}
                                            className="max-w-full"
                                        />
                                    :   <div className="w-[80px] h-[120px] bg-slate-300/20 grid place-items-center">
                                            movie poster unavailable
                                        </div>
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
                </>
            )}
            {tvList && (
                <>
                    <h2>tv shows</h2>
                    <ul className="grid grid-cols-[repeat(auto-fill,_10vw)] md:grid-cols-[repeat(auto-fill,_7vw)] gap-2 xl:grid-cols-[repeat(auto-fill,_6vw)] 2xl:grid-cols-[repeat(auto-fill,_4vw)] bg-slate-900 p-4 place-items-start w-full">
                        {tvList.map((show: any, index: number) => (
                            <li className="p-1 hover:bg-brand-blue" key={index}>
                                <button
                                    className="focus:outline-none focus:ring focus:ring-brand-blue"
                                    onClick={() =>
                                        router.push(`/tv/${show.id.toString()}`)
                                    }
                                >
                                    {show.poster_path ?
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                                            alt={`Poster for ${show.title}`}
                                            width={80}
                                            height={120}
                                        />
                                    :   <div className="w-[80px] h-[120px] bg-slate-300/20 grid place-items-center">
                                            movie poster unavailable
                                        </div>
                                    }
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
