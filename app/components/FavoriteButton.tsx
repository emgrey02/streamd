'use client';
import { addToFavorites, getFavorites, removeFavorite } from '../actions';
import { useEffect, useState } from 'react';

export default function FavoriteButton({
    movieId,
    accountId,
}: {
    movieId: string;
    accountId: string;
}) {
    const [favorites, setFavorites] = useState([]);
    const [canFavorite, setCanFavorite] = useState<boolean>(true);

    async function retrieveFavorites() {
        let favorites = await getFavorites(accountId);
        console.log(favorites);
        setFavorites(favorites);
    }

    useEffect(() => {
        retrieveFavorites();
    }, []);

    useEffect(() => {
        if (favorites.length > 0) {
            let res = favorites.find((m: { id: string }) => {
                return m.id.toString() == movieId.toString();
            });
            if (res === undefined) {
                console.log('no match found');
                setCanFavorite(true);
            } else {
                console.log("it's a match:" + res);
                setCanFavorite(false);
            }
        }
    }, [favorites]);

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        let target = e.target as HTMLButtonElement;
        let text = target.innerText;

        if (text === 'Favorite') {
            addToFavorites(movieId, accountId);
            setCanFavorite(false);
        } else {
            removeFavorite(movieId, accountId);
            setCanFavorite(true);
        }
    }

    return (
        <>
            {canFavorite ?
                <button onClick={handleClick}>Favorite</button>
            :   <button onClick={handleClick}>UnFavorite</button>}
        </>
    );
}
