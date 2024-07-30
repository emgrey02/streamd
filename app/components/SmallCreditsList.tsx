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
    let creds = props.creds;

    useEffect(() => {
        let width = window.innerWidth;
        setWindowWidth(width);
    }, [windowWidth]);

    console.log(creds.length);

    return (
        <div className={`flex flex-col`}>
            {creds && creds.length > 0 ?
                <div className="@container">
                    <ul
                        className={`grid ${creds.length == 1 && '@lg:grid-cols-1 @2xl:grid-cols-1'} ${creds.length == 2 && `@lg:grid-cols-2 @2xl:grid-cols-2`} ${creds.length > 2 && 'grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3'} gap-4 gap-y-6 justify-start`}
                    >
                        {creds.map(
                            (p: any, index: number) =>
                                index < 4 && (
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
            :   <div>no credits available...</div>}
            <Link className="self-end my-2" href={`${props.showId}/credits`}>
                See All Credits
            </Link>
        </div>
    );
}
