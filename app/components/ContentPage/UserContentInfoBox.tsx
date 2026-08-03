'use server';

import AddToListButton from '@/app/components/ContentPage/AddToListButton';
import { cookies } from 'next/headers';
import SubmitRating from '@/app/components/ContentPage/SubmitRating';
import FavorWatchButton from '@/app/components/ContentPage/FavorWatchButton';
import { fetchTmdb } from '@/app/lib/tmdb';

export default async function UserContentInfoBox(props: {
    id: string;
    content: string;
}) {
    const id = props.id;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    const accountId = cookieStore.get('accId')?.value;
    const accountObjectId = cookieStore.get('accountObjectId')?.value;
    const accessToken = cookieStore.get('accessToken')?.value;

    let favWatchRated;
    let deets;

    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'force-cache',
    };

    if (accountId && sessionId) {
        const accountInfoOptions: RequestInit = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
            },
            cache: 'no-store',
        };

        if (props.content == 'movie') {
            [favWatchRated, deets] = await Promise.all([
                fetchTmdb(
                    `https://api.themoviedb.org/3/movie/${id}/account_states?session_id=${sessionId}`,
                    accountInfoOptions,
                    'fetch movie fav/watch/rated info'
                ),
                fetchTmdb(
                    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
                    options,
                    'fetch movie data'
                ),
            ]);
        } else {
            [favWatchRated, deets] = await Promise.all([
                fetchTmdb(
                    `https://api.themoviedb.org/3/tv/${id}/account_states?session_id=${sessionId}`,
                    accountInfoOptions,
                    'fetch tv fav/watch/rated info'
                ),
                fetchTmdb(
                    `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
                    options,
                    'fetch tv data'
                ),
            ]);
        }
    }

    return (
        <>
            {accountId && sessionId && (
                <div className="flex flex-col gap-4 self-end w-full grow bg-slate-900/60 p-4">
                    {props.content == 'movie'}
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-2 @sm:flex @sm:flex-row @sm:gap-4 w-full">
                            <FavorWatchButton
                                whichOne="favorite"
                                content={
                                    props.content == 'movie' ? 'movie' : 'tv'
                                }
                                favorited={favWatchRated.favorite}
                                contentId={deets.id}
                                accountId={accountId}
                                sessionId={sessionId}
                            />
                            <FavorWatchButton
                                whichOne="watchlist"
                                content={
                                    props.content == 'movie' ? 'movie' : 'tv'
                                }
                                watchlisted={favWatchRated.watchlist}
                                contentId={deets.id}
                                accountId={accountId}
                                sessionId={sessionId}
                            />
                        </div>
                        <SubmitRating
                            content={props.content == 'movie' ? 'movie' : 'tv'}
                            id={deets.id}
                            sessionId={sessionId}
                            voteAvg={deets.vote_average}
                            totalVotes={deets.vote_count}
                        />
                        <AddToListButton
                            accountObjectId={accountObjectId || ''}
                            accessToken={accessToken || ''}
                            mediaType={
                                props.content == 'movie' ? 'movie' : 'tv'
                            }
                            mediaId={deets.id}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
