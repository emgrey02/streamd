import BackButton from '@/app/components/BackButton';
import Card from '@/app/components/Card';
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
        `https://api.themoviedb.org/3/person/${creditId}?append_to_response=combined_credits&language=en-US`,
        options
    );

    const creditsPerson = await res.json();
    const credits = creditsPerson.combined_credits;
    console.log(creditsPerson);

    if (!res.ok) {
        console.error('failed to get person credits');
    }

    return (
        <div className="m-4">
            <BackButton />
            <div className="flex gap-4 mb-8">
                {creditsPerson.profile_path ?
                    <Image
                        src={`https://image.tmdb.org/t/p/w200${creditsPerson.profile_path}`}
                        alt={`${creditsPerson.name} profile image`}
                        width={200}
                        height={300}
                    />
                :   <div className="w-[200px] h-[300px] grid place-items-center text-center bg-slate-300/20">
                        {creditsPerson.name} profile image unavailable
                    </div>
                }
                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">{creditsPerson.name}</h1>
                    <p>Born {creditsPerson.birthday}</p>
                    {creditsPerson.deathday && (
                        <p>Death: {creditsPerson.deathday}</p>
                    )}
                </div>
            </div>
            <div className="w-full h-[2px] bg-slate-900 my-8"></div>
            <div id="cast" className="mb-8">
                <h2 className="font-bold text-xl">Cast Credits</h2>
                <Link
                    href="#crew"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Skip to Crew Credits
                </Link>
            </div>
            <ul className="flex flex-wrap gap-4 gap-y-10">
                {credits &&
                    credits.cast.map(
                        (m: any, index: Key | null | undefined) => (
                            <li
                                data-num={index}
                                className="flex flex-col w-full justify-between h-[370px]"
                                key={index}
                            >
                                <Card
                                    data={m}
                                    type={m.media_type}
                                    search={false}
                                />
                            </li>
                        )
                    )}
            </ul>
            <BackButton />
            <div id="crew" className="mb-8">
                <h2 className="text-xl font-bold">Crew Credits</h2>
                <Link
                    href="#cast"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Back to Cast Credits
                </Link>
            </div>
            <ul className="flex flex-wrap gap-4 gap-y-10">
                {credits &&
                    credits.crew.map(
                        (m: any, index: Key | null | undefined) => (
                            <li
                                data-num={index}
                                className=" grid px-2 gap-2"
                                key={index}
                            >
                                <Card
                                    data={m}
                                    type={m.media_type}
                                    search={false}
                                />
                            </li>
                        )
                    )}
            </ul>
            <BackButton />
        </div>
    );
}
