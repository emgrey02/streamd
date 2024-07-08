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
        `https://api.themoviedb.org/3/movie/${params.id}/credits?language=en-US`,
        options
    );

    const credits = await res.json();
    console.log(credits);

    if (!res.ok) {
        console.error('failed to get movie credits');
    }

    return (
        <div className="m-4">
            <BackButton />
            <h1 className="text-xl font-bold my-8">Full Cast</h1>
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
                                    <p className="font-bold">{m.name}</p>
                                    <p className="text-sm">as {m.character}</p>
                                </div>
                                <div>
                                    <Link
                                        className="w-full h-full"
                                        href={`/person/${m.id.toString()}`}
                                    >
                                        {m.profile_path ?
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${m.profile_path}`}
                                                alt={`${m.name} profile picture`}
                                                width={200}
                                                height={300}
                                            />
                                        :   <div className="w-[200px] h-[300px] grid place-items-center text-center bg-slate-300/20">
                                                {m.name} profile unavailable
                                            </div>
                                        }
                                    </Link>
                                </div>
                            </li>
                        )
                    )}
            </ul>
            <BackButton />
            <h2 className="text-xl font-bold my-8">Full Crew</h2>
            <ul id="scroll-cont" className="flex flex-wrap gap-4 gap-y-10">
                {credits &&
                    credits.crew.map(
                        (m: any, index: Key | null | undefined) => (
                            <li
                                data-num={index}
                                className="flex flex-col w-full justify-between h-[370px]"
                                key={index}
                            >
                                <div className="max-w-[200px]">
                                    <p className="font-bold">{m.name}</p>
                                    <p className="text-sm">{m.job}</p>
                                </div>
                                <div>
                                    <Link
                                        className="w-full h-full"
                                        href={`/person/${m.id.toString()}`}
                                    >
                                        {m.profile_path ?
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${m.profile_path}`}
                                                alt={`${m.name} profile picture`}
                                                width={200}
                                                height={300}
                                            />
                                        :   <div className="w-[200px] h-[300px] grid place-items-center text-center bg-slate-300/20">
                                                {m.name} profile unavailable
                                            </div>
                                        }
                                    </Link>
                                </div>
                            </li>
                        )
                    )}
            </ul>
            <BackButton />
        </div>
    );
}
