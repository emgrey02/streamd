'use client';
import { useEffect, useState } from 'react';
import NewCard from './NewCard';
import Link from 'next/link';

export default function SmallCreditsList(props: {
    creds: any;
    showId: string;
    cont?: string;
    personId?: string;
}) {
    const [windowWidth, setWindowWidth] = useState<number>();
    let cast = props.creds.cast;
    let crew = props.creds.crew;
    let ca = cast;
    let cr = crew;

    if (props.personId) {
        ca = cast.toReversed();
        cr = crew.toReversed();
    }

    useEffect(() => {
        let width = window.innerWidth;
        setWindowWidth(width);
    }, [windowWidth]);

    return (
        <div className="flex flex-col gap-10">
            {ca && ca.length > 0 && (
                <div>
                    <h2 className="text-xl mb-2">Cast</h2>
                    <ul className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 justify-start mb-8">
                        {ca.map(
                            (p: any, index: number) =>
                                index < 6 && (
                                    <li key={index}>
                                        <NewCard
                                            data={p}
                                            type={props.cont}
                                            search={false}
                                            credits={true}
                                            fwr={false}
                                            seasons={false}
                                        />
                                    </li>
                                )
                        )}
                    </ul>
                </div>
            )}
            {cr && cr.length > 0 && (
                <div>
                    <h2 className="text-xl mb-2">Crew</h2>
                    <ul className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 justify-start mb-8">
                        {cr.map(
                            (p: any, index: number) =>
                                index < 4 && (
                                    <li
                                        key={index}
                                        className="flex flex-col justify-between "
                                    >
                                        <NewCard
                                            data={p}
                                            type={props.cont}
                                            search={false}
                                            credits={true}
                                            fwr={false}
                                            seasons={false}
                                        />
                                    </li>
                                )
                        )}
                    </ul>
                </div>
            )}
            <Link
                className="self-end mb-10 mx-8"
                href={`${props.showId}/credits`}
            >
                See All Credits
            </Link>
        </div>
    );
}
