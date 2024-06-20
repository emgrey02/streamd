import { auth, currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { Key } from 'react';

const dynamic = 'force-dynamic';

export default async function Page() {
    const { userId } = auth();

    const user = await currentUser();

    let favMovies;

    if (userId) {
        const accountId = user?.publicMetadata.accountId;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
            },
        };

        let res = await fetch(
            `https://api.themoviedb.org/4/account/${accountId}/movie/favorites?page=1&language=en-US`,
            options
        );

        if (!res.ok) {
            console.error('failed to fetch favorite movies');
        }

        favMovies = await res.json();
    }

    return (
        <>
            <h1>User Dashboard</h1>
            {userId && <p>{user?.firstName}</p>}
            <h2> your favorite movies:</h2>
            {favMovies && favMovies.results.length >= 1 ?
                <ul>
                    {favMovies.results.map(
                        (
                            movie: {
                                poster_path: string;
                                title: string;
                                overview: string;
                            },
                            index: Key | null | undefined
                        ) => (
                            <li key={index}>
                                <Image
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt="movie poster"
                                    width={200}
                                    height={300}
                                />
                                <p>{movie.title}</p>
                                <p>{movie.overview}</p>
                            </li>
                        )
                    )}
                </ul>
            :   <p>you haven't favorited any movies!</p>}
        </>
    );
}
