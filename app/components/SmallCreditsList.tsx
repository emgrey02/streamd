'use client';
import { useEffect, useState } from 'react';
import NewCard from './NewCard';

export default function SmallCreditsList(props: {
    setIt: any;
    creds: any;
    cont?: string;
    personId?: string;
}) {
    const [windowWidth, setWindowWidth] = useState<number>();
    console.log(props.creds);
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
                    <ul className="flex flex-wrap gap-4 justify-start">
                        {ca.map(
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
            {cr && cr.length > 0 && (
                <div>
                    <h2 className="text-xl mb-2">Crew</h2>
                    <ul className="flex flex-wrap gap-4 justify-start">
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
            <button
                className="self-end mb-10 mx-8"
                onClick={() => {
                    props.setIt('credits');
                }}
            >
                See All Credits
            </button>
        </div>
    );
}
