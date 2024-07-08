import BackButton from '@/app/components/BackButton';
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
    console.log(credits.crew);

    if (!res.ok) {
        console.error('failed to get person credits');
    }

    return (
        <div className="m-4">
            <BackButton />
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
            <h1 className="text-xl font-bold my-8">
                {creditsPerson.name}: Cast Credits
            </h1>
            <ul id="scroll-cont" className="flex flex-wrap gap-4 gap-y-10">
                {credits &&
                    credits.cast.map(
                        (m: any, index: Key | null | undefined) => (
                            <li
                                data-num={index}
                                className="flex flex-col w-full justify-between h-[370px]"
                                key={index}
                            >
                                <div className="max-w-[200px]">
                                    <p className="font-bold">
                                        {m.title || m.name}
                                    </p>
                                    <p className="text-sm">
                                        as {m.character || m.character}
                                    </p>
                                </div>
                                <div>
                                    <Link
                                        className="w-full h-full"
                                        href={`/${m.media_type}/${m.id.toString()}`}
                                    >
                                        {m.poster_path ?
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                                                alt={`${m.title || m.name} poster`}
                                                width={200}
                                                height={300}
                                            />
                                        :   <div className="w-[200px] h-[300px] grid place-items-center text-center bg-slate-300/20">
                                                {m.title || m.name} poster
                                                unavailable
                                            </div>
                                        }
                                    </Link>
                                </div>
                            </li>
                        )
                    )}
            </ul>
            <BackButton />
            <h2 className="text-xl font-bold my-8">Crew Credits</h2>
            <ul id="scroll-cont" className="flex flex-wrap gap-4 gap-y-10">
                {credits &&
                    credits.crew.map(
                        (m: any, index: Key | null | undefined) => (
                            <li
                                data-num={index}
                                className=" grid px-2 gap-2"
                                key={index}
                            >
                                <p className="font-bold">{m.title || m.name}</p>
                                <p className="text-sm">{m.job}</p>
                                <Link
                                    className="w-full h-full"
                                    href={`/${m.media_type}/${m.id.toString()}`}
                                >
                                    {m.poster_path ?
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                                            alt={`${m.name} poster unavailable`}
                                            width={184}
                                            height={276}
                                        />
                                    :   <div className="w-[184px] h-[276px] grid place-items-center text-center bg-slate-300/20">
                                            {m.name} profile unavailable
                                        </div>
                                    }
                                </Link>
                            </li>
                        )
                    )}
            </ul>
            <BackButton />
        </div>
    );
}
