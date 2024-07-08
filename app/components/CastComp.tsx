'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Credits {
    id: number;
    cast: Array<object>[];
    crew: Array<object>[];
}

export default function CastComp(props: {
    creds: Credits;
    cont?: string;
    personId?: string;
}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    console.log(windowWidth);
    console.log(props.creds);
    console.log(props.cont);
    console.log(props.personId);

    useEffect(() => {
        let width = window.innerWidth;
        setWindowWidth(width);
    }, [windowWidth]);

    return (
        <div className="flex flex-col">
            <h2 className="my-8 font-bold text-xl">Cast</h2>
            <ul className="flex flex-wrap gap-4 gap-y-10">
                {props.creds.cast &&
                    props.creds.cast.map(
                        (p: any, index: number) =>
                            index < +`${windowWidth >= 1024 ? 12 : 8}` && (
                                <li
                                    key={index}
                                    className="flex flex-col w-full justify-between h-[370px]"
                                >
                                    <div className="max-w-[200px]">
                                        <p className="font-bold text-base tracking-wide">
                                            {p.name || p.title}
                                        </p>
                                        <p className="text-sm">
                                            as{' '}
                                            {p.character ||
                                                (p.roles &&
                                                    p.roles[0].character) ||
                                                'unknown'}
                                        </p>
                                    </div>
                                    <div className="grid min-w-36 self-end">
                                        {p.profile_path || p.poster_path ?
                                            <Link
                                                href={
                                                    p.media_type ?
                                                        `/${p.media_type}/${p.id}`
                                                    :   `/person/${p.id}`
                                                }
                                            >
                                                <Image
                                                    src={`https://image.tmdb.org/t/p/w200/${p.media_type ? p.poster_path : p.profile_path}`}
                                                    alt={`${p.name} headshot`}
                                                    width={'200'}
                                                    height={'300'}
                                                />
                                            </Link>
                                        :   <div className="w-[200px] h-[300px] bg-slate-900/80 text-slate-400 grid place-items-center">
                                                no image available
                                            </div>
                                        }
                                    </div>
                                </li>
                            )
                    )}
            </ul>
            <Link
                className="self-end my-8"
                href={
                    props.cont ?
                        `/${props.cont}/${props.creds.id}/credits`
                    :   `/person/${props.personId}/credits`
                }
            >
                See All Credits
            </Link>
        </div>
    );
}
