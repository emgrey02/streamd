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
        `https://api.themoviedb.org/3/tv/${params.id}?append_to_response=aggregate_credits&language=en-US`,
        options
    );

    const creditsTv = await res.json();
    const credits = creditsTv.aggregate_credits;
    console.log(creditsTv);

    if (!res.ok) {
        console.error('failed to get tv credits');
    }

    return (
        <div className="m-4">
            <BackButton />
            <CreditsHeader data={creditsTv} type="tv" />
            <BackButton />
            <div id="cast" className="flex flex-col mb-8">
                <h1 className="text-xl font-bold ">Full Cast</h1>
                <Link
                    href="#crew"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Skip to Full Crew
                </Link>
            </div>
            <ul
                id="scroll-cont"
                className="flex flex-wrap gap-4 gap-y-10 justify-center sm:justify-start"
            >
                {credits &&
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
                    <p>{creditsTv.name} doesn&apos;t have any Cast Members.</p>
                )}
            </ul>
            <BackButton />
            <div id="crew" className="flex flex-col mb-8">
                <h1 className="text-xl font-bold ">Full Crew</h1>
                <Link
                    href="#cast"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Back to Full Cast
                </Link>
            </div>
            <ul
                id="scroll-cont"
                className="flex flex-wrap gap-4 gap-y-10 justify-center sm:justify-start"
            >
                {credits &&
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
                    <p>{creditsTv.title} doesn&apos;t have any Crew Members.</p>
                )}
            </ul>
            <BackButton />
        </div>
    );
}
