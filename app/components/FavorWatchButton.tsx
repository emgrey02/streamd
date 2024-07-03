'use client';
import {
    addToFavorWatch,
    removeFavorWatch,
    getContentAccountInfo,
    getSessionId,
} from '../actions';
import { useEffect, useState } from 'react';

export default function FavorWatchButton({
    whichOne,
    content,
    contentId,
    accountId,
    sessionId,
}: {
    whichOne: string;
    content: string;
    contentId: string;
    accountId: string;
    sessionId: string;
}) {
    const [canFavorite, setCanFavorite] = useState<boolean>(true);
    const [canAddToWatchlist, setCanAddToWatchlist] = useState<boolean>(true);
    console.log('sessionId: ', sessionId);

    useEffect(() => {
        async function setStates() {
            const accountInfo = await getContentAccountInfo(
                sessionId,
                content,
                contentId
            );

            if (accountInfo.favorite) {
                setCanFavorite(false);
            } else {
                setCanFavorite(true);
            }

            if (accountInfo.watchlist) {
                setCanAddToWatchlist(false);
            } else {
                setCanAddToWatchlist(true);
            }
        }
        setStates();
    }, [content, contentId, sessionId]);

    async function handleClick(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        let target = e.target as HTMLButtonElement;
        let text = target.innerText;

        switch (text) {
            case 'Favorite':
                let s1 = await addToFavorWatch(
                    'favorite',
                    content,
                    contentId,
                    accountId,
                    sessionId
                );
                if (s1) {
                    setCanFavorite(false);
                }
                break;
            case 'UnFavorite':
                let s2 = await removeFavorWatch(
                    'favorite',
                    content,
                    contentId,
                    accountId,
                    sessionId
                );
                if (s2) {
                    setCanFavorite(true);
                }
                break;
            case 'Add to Watchlist':
                let s3 = await addToFavorWatch(
                    'watchlist',
                    content,
                    contentId,
                    accountId,
                    sessionId
                );
                if (s3) {
                    setCanAddToWatchlist(false);
                }
                break;
            case 'Remove from Watchlist':
                let s4 = await removeFavorWatch(
                    'watchlist',
                    content,
                    contentId,
                    accountId,
                    sessionId
                );
                if (s4) {
                    setCanAddToWatchlist(true);
                }
                break;
        }
    }

    return (
        <>
            {whichOne === 'favorite' ?
                <button className="w-min" onClick={handleClick}>
                    {canFavorite ? 'Favorite' : 'UnFavorite'}
                </button>
            :   <button className="w-min" onClick={handleClick}>
                    {canAddToWatchlist ?
                        'Add to Watchlist'
                    :   'Remove from Watchlist'}
                </button>
            }
        </>
    );
}
