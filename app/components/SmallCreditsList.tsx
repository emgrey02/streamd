'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Card from './Card';
import NewCard from './NewCard';

interface Credits {
    id: number;
    cast: Array<object>[];
    crew: Array<object>[];
}

export default function SmallCreditsList(props: {
    creds: Credits;
    cont?: string;
    personId?: string;
}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    let cast = props.creds.cast;
    let c = cast;

    if (props.personId) {
        c = cast.toReversed();
    }
    console.log(c);
    console.log(props.personId);

    useEffect(() => {
        let width = window.innerWidth;
        setWindowWidth(width);
    }, [windowWidth]);

    return (
        <div className="flex flex-col">
            <ul className="flex flex-wrap gap-4 justify-start">
                {c &&
                    c.map(
                        (p: any, index: number) =>
                            index < 8 && (
                                <li
                                    key={index}
                                    className="flex flex-col justify-between "
                                >
                                    <NewCard
                                        data={p}
                                        type={props.cont}
                                        search={false}
                                        credits={true}
                                    />
                                </li>
                            )
                    )}
            </ul>
            <Link
                className="self-end my-8 mx-12"
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
