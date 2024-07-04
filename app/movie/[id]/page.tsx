'use server';

import Image from 'next/image';
import { Key } from 'react';
import BackButton from '@/app/components/BackButton';
import Link from 'next/link';
import { cookies } from 'next/headers';
import FavorWatchButton from '@/app/components/FavorWatchButton';

export default async function Movie({ params }: { params: { id: string } }) {
    let movieId = params.id;

    const sessionId = cookies().get('sessionId')?.value;
    const accountId = cookies().get('accId')?.value;

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

    let creditsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    if (!creditsRes.ok) {
        console.error('failed to fetch movie cast & crew data');
    }

    let deets = await res.json();
    let creds = await creditsRes.json();

    return (
        <div className="m-8">
            <div className="grid gap-4 md:flex">
                <Image
                    src={`https://image.tmdb.org/t/p/w400${deets.poster_path}`}
                    alt="movie poster"
                    width={400}
                    height={600}
                    priority
                />
                <div className="grid gap-4">
                    <h1 className="text-2xl font-bold text-slate-200">
                        {deets.title}
                    </h1>
                    <p>{deets.tagline}</p>
                    <ul className="flex flex-wrap gap-4">
                        <h2>Genres:</h2>
                        {deets.genres.map(
                            (genre: { name: string }, index: Key) => (
                                <li
                                    className="w-min ring-1 rounded-lg h-min px-2 py-0 ring-slate-400"
                                    key={index}
                                >
                                    {genre.name}
                                </li>
                            )
                        )}
                    </ul>
                    {accountId && sessionId && (
                        <div className="grid grid-cols-2 w-64">
                            <FavorWatchButton
                                whichOne="favorite"
                                content="movie"
                                contentId={deets.id}
                                accountId={accountId}
                                sessionId={sessionId}
                            />
                            <FavorWatchButton
                                whichOne="watchlist"
                                content="movie"
                                contentId={deets.id}
                                accountId={accountId}
                                sessionId={sessionId}
                            />
                        </div>
                    )}
                    <p>{deets.release_date}</p>
                    <p className="max-w-xl">{deets.overview}</p>
                </div>
            </div>
            <BackButton />
            <div className="flex flex-col">
                <h2 className="my-8 font-bold text-xl">Cast</h2>
                <ul className="grid grid-flow-col grid-rows-4 md:grid-rows-3 lg:grid-rows-2 2xl:grid-rows-1 place-items-center gap-8 text-sm">
                    {creds.cast.map(
                        (p: any, index: number) =>
                            index < 8 && (
                                <li
                                    key={index}
                                    className="grid gap-y-2 w-full h-full"
                                >
                                    <p className="font-bold text-base tracking-wide">
                                        {p.name}
                                    </p>
                                    <p>as {p.character}</p>
                                    <div className="h-full grid justify-center items-end min-w-36">
                                        {p.profile_path ?
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${p.profile_path}`}
                                                alt={`${p.name} headshot`}
                                                width={'150'}
                                                height={'275'}
                                            />
                                        :   <div className="w-36 h-56 bg-slate-900/80 text-slate-400 grid place-items-center">
                                                no image available
                                            </div>
                                        }
                                    </div>
                                </li>
                            )
                    )}
                </ul>
                <Link className="self-end my-8" href="">
                    See All Cast & Crew
                </Link>
            </div>
        </div>
    );
}
