import Image from 'next/image';
import { Key } from 'react';
import Link from 'next/link';

interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export default async function Page({
    params,
}: {
    params: { cat: string; page: string };
}) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/movie/${params.cat}?language=en-US&page=${params.page}`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch now playing movies');
    }

    const movies = await res.json();
    const totalPages = movies.total_pages;
    return (
        <>
            <h1 className="font-medium text-center">{params.cat}</h1>
            <div className="grid grid-cols-2 px-4 py-8">
                {+params.page > 1 && (
                    <Link
                        className="col-start-1"
                        href={`/${params.cat}/${+params.page - 1}`}
                    >
                        Previous
                    </Link>
                )}
                {+params.page < totalPages && (
                    <Link
                        className="col-start-2 justify-self-end"
                        href={`/${params.cat}/${+params.page + 1}`}
                    >
                        Next
                    </Link>
                )}
            </div>
            {movies && movies.results.length >= 1 && (
                <ul
                    id="scroll-cont"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 place-items-center gap-y-16"
                >
                    {movies.results.map(
                        (m: Movie, index: Key | null | undefined) => (
                            <li
                                data-num={index}
                                className="min-w-56 grid px-2 place-content-center place-items-center"
                                key={index}
                            >
                                <h3>{m.title}</h3>
                                <Image
                                    src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                                    alt="movie poster"
                                    width={200}
                                    height={300}
                                />
                                <p>{m.release_date}</p>
                            </li>
                        )
                    )}
                </ul>
            )}
            <div className="grid grid-cols-2 px-4 py-8">
                {+params.page > 1 && (
                    <Link
                        className="col-start-1"
                        href={`/${params.cat}/${+params.page - 1}`}
                    >
                        Previous
                    </Link>
                )}
                {+params.page < totalPages && (
                    <Link
                        className="col-start-2 justify-self-end"
                        href={`/${params.cat}/${+params.page + 1}`}
                    >
                        Next
                    </Link>
                )}
            </div>
        </>
    );
}
