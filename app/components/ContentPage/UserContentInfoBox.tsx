'use client';

import { useEffect, useState } from 'react';
import AddToListButton from '@/app/components/ContentPage/AddToListButton';
import SubmitRating from '@/app/components/ContentPage/SubmitRating';
import FavorWatchButton from '@/app/components/ContentPage/FavorWatchButton';
import { getContentUserState } from '@/app/actions/favorites';
import { useUsername } from '@/app/lib/useUsername';

type UserState = {
    favorite: boolean;
    watchlist: boolean;
    sessionId: string;
    accessToken: string;
    accountId: string;
    accountObjectId: string;
};

export default function UserContentInfoBox(props: {
    id: string;
    content: string;
    voteAvg: number;
    totalVotes: number;
}) {
    const username = useUsername();
    const [state, setState] = useState<UserState | null>(null);
    const contentId = +props.id;

    useEffect(() => {
        if (!username) {
            return;
        }

        let cancelled = false;

        getContentUserState(props.content, contentId).then((result) => {
            if (!cancelled) setState(result);
        });

        return () => {
            cancelled = true;
        };
    }, [username, props.content, contentId]);

    if (!state) return null;

    return (
        <div className="flex flex-col gap-4 self-end w-full grow bg-slate-900/60 p-4">
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-2 @sm:flex @sm:flex-row @sm:gap-4 w-full">
                    <FavorWatchButton
                        whichOne="favorite"
                        content={props.content == 'movie' ? 'movie' : 'tv'}
                        favorited={state.favorite}
                        contentId={contentId}
                        accountId={state.accountId}
                        sessionId={state.sessionId}
                    />
                    <FavorWatchButton
                        whichOne="watchlist"
                        content={props.content == 'movie' ? 'movie' : 'tv'}
                        watchlisted={state.watchlist}
                        contentId={contentId}
                        accountId={state.accountId}
                        sessionId={state.sessionId}
                    />
                </div>
                <SubmitRating
                    content={props.content == 'movie' ? 'movie' : 'tv'}
                    id={contentId}
                    sessionId={state.sessionId}
                    voteAvg={props.voteAvg}
                    totalVotes={props.totalVotes}
                />
                <AddToListButton
                    accountObjectId={state.accountObjectId}
                    accessToken={state.accessToken}
                    mediaType={props.content == 'movie' ? 'movie' : 'tv'}
                    mediaId={contentId}
                />
            </div>
        </div>
    );
}
