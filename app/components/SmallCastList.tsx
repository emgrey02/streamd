'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Card from './Card';

interface Credits {
    id: number;
    cast: Array<object>[];
    crew: Array<object>[];
}

export default function SmallCastList(props: {
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
            <ul className="flex flex-wrap gap-4 gap-y-10 justify-center sm:justify-start">
                {props.creds.cast &&
                    props.creds.cast.map(
                        (p: any, index: number) =>
                            index < +`${windowWidth >= 1024 ? 12 : 8}` && (
                                <li
                                    key={index}
                                    className="flex flex-col w-full h-full justify-between sm:h-[370px]"
                                >
                                    <Card
                                        data={p}
                                        type={props.cont}
                                        search={false}
                                    />
                                </li>
                            )
                    )}
            </ul>
            <Link
                className="self-end my-8"
                href={
                    props.personId ?
                        `/person/${props.personId}/credits`
                    :   `/${props.cont}/${props.creds.id}/credits`
                }
            >
                See All Credits
            </Link>
        </div>
    );
}
