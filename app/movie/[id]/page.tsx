'use server';

import Image from 'next/image';
import { Key } from 'react';
import { User, currentUser } from '@clerk/nextjs/server';
import FavoriteButton from '@/app/components/FavoriteButton';
import Link from 'next/link';

export default async function Movie({ params }: { params: { id: string } }) {
    let movieId = params.id;
    let accountId: unknown;

    const user: User | null = await currentUser();

    if (user) {
        accountId = user.publicMetadata.accountId;
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch data');
    }

    let deets = await res.json();

    return (
        <>
            <div className="flex gap-4">
                <Image
                    src={`https://image.tmdb.org/t/p/w400${deets.poster_path}`}
                    alt="movie poster"
                    width={400}
                    height={1200}
                />
                <div className="flex flex-col gap-4">
                    <h1>{deets.title}</h1>
                    <p>{deets.tagline}</p>
                    <ul>
                        <h2>Genres:</h2>
                        {deets.genres.map(
                            (genre: { name: string }, index: Key) => (
                                <li key={index}>{genre.name}</li>
                            )
                        )}
                    </ul>
                    {typeof accountId === 'string' && (
                        <FavoriteButton
                            movieId={deets.id}
                            accountId={accountId}
                        />
                    )}
                </div>
            </div>
            <p>{deets.release_date}</p>
            <p>{deets.overview}</p>
            <Link href="/">Back</Link>
        </>
    );
}
