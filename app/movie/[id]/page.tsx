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
import Link from 'next/link';

export default async function Movie({ params }: { params: { id: string[] } }) {
    let movieId = params.id;
    console.log(movieId);

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

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    if (!creditsRes.ok) {
        console.error('failed to fetch movie cast & crew data');
    }

    let deets = await res.json();
    let creds = await creditsRes.json();

    console.log(deets);

    return (
        <>
            <SmallCreditsList creds={creds} cont="movie" />
        </>
    );
}
