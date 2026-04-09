'use server';

import AddToListButton from '@/app/components/ContentPage/AddToListButton';
import { cookies } from 'next/headers';
import SubmitRating from '@/app/components/ContentPage/SubmitRating';
import FavorWatchButton from '@/app/components/ContentPage/FavorWatchButton';

export default async function UserContentInfoBox(props: { id: string }) {
    const id = props.id;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    const accountId = cookieStore.get('accId')?.value;
    const accountObjectId = cookieStore.get('accountObjectId')?.value;
    const accessToken = cookieStore.get('accessToken')?.value;

    const accountInfoOptions: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'no-store',
    };

    const movieFavWatchRated = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/account_states?session_id=${sessionId}`,
        accountInfoOptions
    );

    if (!movieFavWatchRated.ok) {
        console.error('failed to fetch movie fav/watch/rated info');
    }

    const favWatchRated = await movieFavWatchRated.json();

    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'force-cache',
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    const deets = await res.json();

    return (
        <>
            {accountId && sessionId && (
                <div className="flex flex-col gap-4 self-end w-full grow bg-slate-900/60 p-4">
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-2 @sm:flex @sm:flex-row @sm:gap-4 w-full">
                            <FavorWatchButton
                                whichOne="favorite"
                                content="movie"
                                favorited={favWatchRated.favorite}
                                contentId={deets.id}
                                accountId={accountId}
                                sessionId={sessionId}
                            />
                            <FavorWatchButton
                                whichOne="watchlist"
                                content="movie"
                                watchlisted={favWatchRated.watchlist}
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
                        <AddToListButton
                            accountObjectId={accountObjectId || ''}
                            accessToken={accessToken || ''}
                            mediaType={'movie'}
                            mediaId={deets.id}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
