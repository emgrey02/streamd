'use client';
import {
    addToFavorWatch,
    getFavorWatch,
    removeFavorWatch,
    getContentAccountInfo,
} from '../actions';
import { useEffect, useState } from 'react';

export default function FavorWatchButton({
    whichOne,
    content,
    contentId,
    accountId,
}: {
    whichOne: string;
    content: string;
    contentId: string;
    accountId: string;
}) {
    const [favorites, setFavorites] = useState([]);
    const [canFavorite, setCanFavorite] = useState<boolean>(true);
    const [watchlist, setWatchlist] = useState([]);
    const [canAddToWatchlist, setCanAddToWatchlist] = useState<boolean>(true);

    console.log(accountId);

    // async function retrieveFavorites() {
    //     let favorites = await getFavorWatch('favorites', accountId, content);
    //     setFavorites(favorites);
    // }

    // async function retrieveWatchlist() {
    //     let watchlist = await getFavorWatch('watchlist', accountId, content);
    //     setWatchlist(watchlist);
    // }

    async function setStates() {
        const accountInfo = await getContentAccountInfo(content, contentId);

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

    // useEffect(() => {
    //     if (whichOne === 'favorite') {
    //         retrieveFavorites();
    //     } else {
    //         retrieveWatchlist();
    //     }
    // }, []);

    useEffect(() => {
        setStates();
    }, []);

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
                    accountId
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
                    accountId
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
                    accountId
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
                    accountId
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
