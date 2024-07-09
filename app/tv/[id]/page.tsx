'use server';

import Image from 'next/image';
import { Key } from 'react';
import FavorWatchButton from '@/app/components/FavorWatchButton';
import BackButton from '@/app/components/BackButton';
import { cookies } from 'next/headers';
import SubmitRating from '@/app/components/SubmitRating';
import Genres from '@/app/components/Genres';
import SmallCastList from '@/app/components/SmallCastList';

export default async function Show({ params }: { params: { id: string } }) {
    let showId = params.id;

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
        `https://api.themoviedb.org/3/tv/${showId}?language=en-US`,
        options
    );

    let creditsRes = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/aggregate_credits?language=en-US`,
        options
    );

    let reviewsRes = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/reviews?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show data');
    }

    if (!creditsRes.ok) {
        console.error('failed to fetch show cast & crew data');
    }

    if (!creditsRes.ok) {
        console.error('failed to fetch show reviews');
    }

    let deets = await res.json();
    let creds = await creditsRes.json();
    let reviews = await reviewsRes.json();

    return (
        <main className="m-2 md:m-4 lg:m-8">
            <div className="grid gap-4 md:flex">
                {deets.poster_path ?
                    <Image
                        className="max-h-600"
                        src={`https://image.tmdb.org/t/p/w400${deets.poster_path}`}
                        alt="tv poster"
                        width={400}
                        height={1200}
                    />
                :   <div className="w-96 h-auto bg-slate-300/20 grid place-items-center">
                        {deets.name} poster unavailable
                    </div>
                }
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-200">
                            {deets.name}
                        </h1>
                        <p className="font-light">tv show</p>
                    </div>
                    <div className="flex gap-4">
                        <p>{deets.number_of_episodes} total episodes</p>
                        <p>{deets.number_of_seasons} seasons</p>
                    </div>
                    <p>{deets.tagline}</p>
                    <Genres data={deets.genres} />
                    {accountId && sessionId && (
                        <>
                            <div className="grid grid-cols-2 w-64">
                                <FavorWatchButton
                                    whichOne="favorite"
                                    content="tv"
                                    contentId={deets.id}
                                    accountId={accountId}
                                    sessionId={sessionId}
                                />
                                <FavorWatchButton
                                    whichOne="watchlist"
                                    content="tv"
                                    contentId={deets.id}
                                    accountId={accountId}
                                    sessionId={sessionId}
                                />
                            </div>
                            <SubmitRating
                                content="tv"
                                id={deets.id}
                                sessionId={sessionId}
                                voteAvg={deets.vote_average}
                                totalVotes={deets.vote_count}
                            />
                        </>
                    )}
                    <p className="max-w-2xl">{deets.overview}</p>
                </div>
            </div>
            <BackButton />
            <SmallCastList creds={creds} cont="tv" />
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
        </main>
    );
}
