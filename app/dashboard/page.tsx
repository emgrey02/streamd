import { kv } from '@vercel/kv';
import Image from 'next/image';
import Link from 'next/link';
import { Key } from 'react';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const userSession: UserSession | null = await kv.get('userSession');
    const accountId: string | undefined = userSession?.account_id;

    cache: 'no-store' as RequestInit;

    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'no-store',
    };

    let res = await fetch(
        `https://api.themoviedb.org/4/account/${accountId}/movie/favorites?page=1&language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch favorite movies');
    }

    const favMovies = await res.json();

    return (
        <>
            <h1>User Dashboard</h1>
            <h2> your favorite movies:</h2>
            {favMovies && favMovies.results.length >= 1 ?
                <ul className="grid grid-flow-col overflow-x-scroll">
                    {favMovies.results.map(
                        (
                            movie: {
                                poster_path: string;
                                title: string;
                                overview: string;
                                id: string;
                            },
                            index: Key | null | undefined
                        ) => (
                            <li className="min-w-56 grid px-2" key={index}>
                                <Link
                                    className="col-start-1"
                                    href={`/movie/${movie.id}`}
                                >
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt="movie poster"
                                        width={200}
                                        height={300}
                                    />
                                </Link>
                                <p>{movie.title}</p>
                            </li>
                        )
                    )}
                </ul>
            :   <p>you haven&apos;t favorited any movies!</p>}
        </>
    );
}
