'use server';

import Image from 'next/image';
import { Key } from 'react';
import BackButton from '@/app/components/BackButton';
import Link from 'next/link';
import { cookies } from 'next/headers';
import FavorWatchButton from '@/app/components/FavorWatchButton';
import SubmitRating from '@/app/components/SubmitRating';

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

    let reviewsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    if (!creditsRes.ok) {
        console.error('failed to fetch movie cast & crew data');
    }

    if (!reviewsRes.ok) {
        console.error('failed to fetch movie reviews');
    }

    let deets = await res.json();
    let creds = await creditsRes.json();
    let reviews = await reviewsRes.json();

    return (
        <div className="m-2 md:m-4 lg:m-8">
            <div className="grid gap-4 md:flex">
                {deets.poster_path ?
                    <Image
                        className="max-h-600"
                        src={`https://image.tmdb.org/t/p/w400${deets.poster_path}`}
                        alt="movie poster"
                        width={400}
                        height={600}
                        priority
                    />
                :   <div className="w-96 bg-slate-300/20 grid place-items-center">
                        {deets.title} poster unavailable
                    </div>
                }
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-200">
                            {deets.title}
                        </h1>
                        <p className="font-light">movie</p>
                    </div>
                    <p>{deets.tagline}</p>
                    <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h2>Genres:</h2>
                        {deets.genres.map(
                            (genre: { name: string }, index: Key) => (
                                <li
                                    className="w-fit text-sm ring-1 rounded-lg h-min px-2 py-0 ring-slate-400"
                                    key={index}
                                >
                                    {genre.name}
                                </li>
                            )
                        )}
                    </ul>
                    {accountId && sessionId && (
                        <>
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
                            <SubmitRating
                                content="movie"
                                id={deets.id}
                                sessionId={sessionId}
                                voteAvg={deets.vote_average}
                                totalVotes={deets.vote_count}
                            />
                        </>
                    )}
                    <p>released {deets.release_date}</p>
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
            <div className="w-full">
                <h2 className="text-xl font-bold my-8">Reviews</h2>
                <ul className="grid max-w-3xl">
                    {reviews.results.map((post: any, index: Key) => (
                        <li key={index} className="grid gap-4">
                            <p>
                                user:{' '}
                                <span className="font-bold">{post.author}</span>
                            </p>
                            <div className="flex flex-col gap-2">
                                <p>
                                    rating:{' '}
                                    {post.author_details.rating ?
                                        post.author_details.rating.toString() +
                                        '/10'
                                    :   'none'}
                                </p>
                                <div className="h-3 w-50 relative overflow-hidden bg-slate-900">
                                    <div
                                        className={`h-full bg-green-300/70 absolute`}
                                        style={{
                                            width: `${post.author_details.rating * 10}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <p className="w-full leading-relaxed">
                                {post.content}
                            </p>
                            <div className="w-full h-[1px] bg-slate-500 my-10"></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
