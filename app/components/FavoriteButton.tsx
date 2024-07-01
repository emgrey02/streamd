'use client';
import { addToFavorites, getFavorites, removeFavorite } from '../actions';
import { useEffect, useState } from 'react';

export default function FavoriteButton({
    content,
    contentId,
    accountId,
}: {
    content: string;
    contentId: string;
    accountId: string;
}) {
    const [favorites, setFavorites] = useState([]);
    const [canFavorite, setCanFavorite] = useState<boolean>(true);

    console.log(accountId);

    async function retrieveFavorites() {
        let favorites = await getFavorites(accountId, content);
        setFavorites(favorites);
    }

    useEffect(() => {
        retrieveFavorites();
    }, []);

    useEffect(() => {
        if (favorites.length > 0) {
            let res = favorites.find((m: { id: string }) => {
                return m.id.toString() == contentId.toString();
            });
            if (res === undefined) {
                setCanFavorite(true);
            } else {
                setCanFavorite(false);
            }
        }
    }, [favorites]);

    async function handleClick(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        let target = e.target as HTMLButtonElement;
        let text = target.innerText;

        if (text === 'Favorite') {
            let success = await addToFavorites(content, contentId, accountId);
            if (success) {
                setCanFavorite(false);
            }
        } else {
            let success = await removeFavorite(content, contentId, accountId);
            if (success) {
                setCanFavorite(true);
            }
        }
    }

    return (
        <>
            {canFavorite ?
                <button className="w-min" onClick={handleClick}>
                    Favorite
                </button>
            :   <button className="w-min" onClick={handleClick}>
                    UnFavorite
                </button>
            }
        </>
    );
}
