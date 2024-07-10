'use server';

import Image from 'next/image';
import FavorWatchButton from '@/app/components/FavorWatchButton';
import BackButton from '@/app/components/BackButton';
import { cookies } from 'next/headers';
import SubmitRating from '@/app/components/SubmitRating';
import Genres from '@/app/components/Genres';
import Reviews from '@/app/components/Reviews';
import SmallCreditsList from '@/app/components/SmallCreditsList';

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

    function getDate(birthday: string) {
        let birthArray = birthday.split('-');
        let months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        let month = months[+birthArray[1] - 1];
        return `${month} ${birthArray[2]}, ${birthArray[0]}`;
    }

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
                    <div className="flex gap-2">
                        <p>{deets.number_of_episodes} total episodes</p>
                        <p>-</p>
                        <p>{deets.number_of_seasons} seasons</p>
                    </div>
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
                    <div>
                        <h2 className="font-bold">First Aired</h2>
                        <p> {getDate(deets.first_air_date)}</p>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Overview</h2>
                        <p className="max-w-2xl">{deets.overview}</p>
                    </div>
                </div>
            </div>
            <BackButton />
            <SmallCreditsList creds={creds} cont="tv" />
            <Reviews reviews={reviews} />
        </main>
    );
}
