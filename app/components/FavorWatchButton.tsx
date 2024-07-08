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
    contentId: number;
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
        let target = e.currentTarget as HTMLButtonElement;
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
        <div className="my-2">
            {whichOne === 'favorite' ?
                <button
                    className="w-fit h-min flex items-center justify-center gap-2"
                    onClick={handleClick}
                >
                    {canFavorite ?
                        <>
                            <svg
                                width="30px"
                                height="30px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z"
                                    className="stroke-brand-blue stroke-1"
                                />
                            </svg>
                            <p>Favorite</p>
                        </>
                    :   <>
                            <svg
                                width="30px"
                                height="30px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z"
                                    className="stroke-brand-blue stroke-1 fill-brand-blue"
                                />
                            </svg>
                            <p>UnFavorite</p>
                        </>
                    }
                </button>
            :   <button
                    className="w-fit h-min flex items-center justify-center gap-2"
                    onClick={handleClick}
                >
                    {canAddToWatchlist ?
                        <>
                            <svg
                                className="fill-brand-blue"
                                width="30px"
                                height="30px"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>Add to watchlist</title>
                                <path d="M16 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4H9v-4H5V9h4V5h2v4h4v2z" />
                            </svg>
                            <p>Add to Watchlist</p>
                        </>
                    :   <>
                            <svg
                                className="fill-brand-blue"
                                width="30px"
                                height="30px"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>Remove from watchlist</title>
                                <path d="M16 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H5V9h10v2z" />
                            </svg>
                            <p>Remove from Watchlist</p>
                        </>
                    }
                </button>
            }
        </div>
    );
}
