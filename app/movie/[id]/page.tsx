'use server';

import Image from 'next/image';
import BackButton from '@/app/components/BackButton';
import { cookies } from 'next/headers';
import FavorWatchButton from '@/app/components/FavorWatchButton';
import SubmitRating from '@/app/components/SubmitRating';
import Genres from '@/app/components/Genres';
import Reviews from '@/app/components/Reviews';
import SmallCreditsList from '@/app/components/SmallCreditsList';
import Text from '@/app/components/Text';

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
                    <Genres data={deets.genres} />
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
                    <div>
                        <h2 className="font-bold">Released</h2>
                        <p>{getDate(deets.release_date)}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Overview</p>
                        <Text text={deets.overview} />
                    </div>
                </div>
            </div>
            <BackButton />
            <SmallCreditsList creds={creds} cont="movie" />
            <Reviews reviews={reviews} />
        </div>
    );
}
