import BackButton from '@/app/components/BackButton';
import Card from '@/app/components/Card';
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
    console.log(creditsMovie);
    const credits = creditsMovie[`credits?language=en-US`];
    console.log(credits);

    if (!res.ok) {
        console.error('failed to get movie credits');
    }

    return (
        <div className="m-4">
            <BackButton />
            <div className="flex gap-4 mb-8">
                {creditsMovie.poster_path ?
                    <Image
                        src={`https://image.tmdb.org/t/p/w200${creditsMovie.poster_path}`}
                        alt={`${creditsMovie.name} profile image`}
                        width={200}
                        height={300}
                    />
                :   <div className="w-[200px] h-[300px] grid place-items-center text-center bg-slate-300/20">
                        {creditsMovie.title} image unavailable
                    </div>
                }
                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">{creditsMovie.title}</h1>
                    <p>Release date: {creditsMovie.release_date}</p>
                    <Genres data={creditsMovie.genres} />
                </div>
            </div>
            <div className="w-full h-[2px] bg-slate-900 my-8"></div>
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
                                <Card data={m} type="person" search={false} />
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
                                <Card data={m} type="person" search={false} />
                            </li>
                        )
                    )}
            </ul>
            <BackButton />
        </div>
    );
}
