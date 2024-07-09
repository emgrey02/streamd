import BackButton from '@/app/components/BackButton';
import Card from '@/app/components/Card';
import CreditsHeader from '@/app/components/CreditsHeader';
import Genres from '@/app/components/Genres';
import Image from 'next/image';
import Link from 'next/link';
import { Key } from 'react';

export default async function Credits({ params }: { params: { id: string } }) {
    const creditId = params.id;
    console.log(creditId);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${params.id}?append_to_response=credits?language=en-US`,
        options
    );

    const creditsMovie = await res.json();
    const credits = creditsMovie[`credits?language=en-US`];

    if (!res.ok) {
        console.error('failed to get movie credits');
    }

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
        <div className="m-4">
            <BackButton />
            <CreditsHeader data={creditsMovie} type="movie" />
            <BackButton />
            <div id="cast" className="flex flex-col mb-8">
                <h1 className="text-xl font-bold">Full Cast</h1>
                <Link
                    href="#crew"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Skip to Full Crew
                </Link>
            </div>
            <ul className="flex flex-wrap gap-4 gap-y-10 justify-center sm:justify-start">
                {credits.cast &&
                    credits.cast.map(
                        (m: any, index: Key | null | undefined) => (
                            <li
                                data-num={index}
                                className="flex flex-col w-full justify-between sm:h-[370px]"
                                key={index}
                            >
                                <Card data={m} type="person" search={false} />
                            </li>
                        )
                    )}
                {credits.cast.length == 0 && (
                    <p>
                        {creditsMovie.title} doesn&apos;t have any Cast Members.
                    </p>
                )}
            </ul>
            <BackButton />
            <div id="crew" className="flex flex-col mb-8">
                <h2 className="text-xl font-bold">Full Crew</h2>
                <Link
                    href="#cast"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Back to Full Cast
                </Link>
            </div>
            <ul className="flex flex-wrap gap-4 gap-y-10 justify-center sm:justify-start">
                {credits.crew &&
                    credits.crew.map(
                        (m: any, index: Key | null | undefined) => (
                            <li
                                data-num={index}
                                className="flex flex-col w-full justify-between sm:h-[370px]"
                                key={index}
                            >
                                <Card data={m} type="person" search={false} />
                            </li>
                        )
                    )}
                {credits.crew.length == 0 && (
                    <p>
                        {creditsMovie.title} doesn&apos;t have any Crew Members.
                    </p>
                )}
            </ul>
            <BackButton />
        </div>
    );
}
