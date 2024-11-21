'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function SearchResNav(props: {
    keyword?: string;
    genre?: string;
    query: string;
    lengths: any;
}) {
    const query = props.query;
    const pathname = usePathname();
    console.log(props.keyword, props.genre);
    console.log(pathname);
    const pathnameArray = pathname.slice(1).split('/');
    console.log(pathnameArray);
    let cat = pathnameArray[1];

    if (props.genre || props.keyword) {
        cat = pathnameArray[1].split('-')[1];
    }

    return (
        <ul
            className={`w-[150px] h-min grid ${props.keyword || props.genre ? 'grid-row-2' : 'grid-rows-4'} bg-slate-950 mb-4`}
        >
            <li className="grid">
                <Link
                    id="movies"
                    className={`w-full hover:bg-slate-800 ${cat === 'movie' ? 'bg-slate-800' : 'bg-slate-600'}`}
                    href={
                        props.keyword ?
                            `/search/keyword-movie?query=${query}&page=1`
                        : props.genre ?
                            `/search/genre-movie?query=${encodeURIComponent(query)}&page=1`
                        :   `/search/movie?query=${query}&page=1`
                    }
                >
                    <div className="flex gap-2 w-full px-4 py-2 justify-end ">
                        <p>Movies</p>
                        <p>{props.lengths.movie}</p>
                    </div>
                </Link>
            </li>
            <li className="grid">
                <Link
                    id="tv"
                    className={`w-full hover:bg-slate-800 ${cat === 'tv' ? 'bg-slate-800' : 'bg-slate-600'}`}
                    href={
                        props.keyword ?
                            `/search/keyword-tv?query=${query}&page=1`
                        : props.genre ?
                            `/search/genre-tv?query=${encodeURIComponent(query)}&page=1`
                        :   `/search/tv?query=${query}&page=1`
                    }
                >
                    <div className="flex gap-2 w-full px-4 py-2 justify-end">
                        <p>Tv</p>
                        <p>{props.lengths.tv}</p>
                    </div>
                </Link>
            </li>
            {!props.keyword && !props.genre && (
                <>
                    <li className="grid">
                        <Link
                            id="people"
                            className={`w-full hover:bg-slate-800 ${cat === 'person' ? 'bg-slate-800' : 'bg-slate-600'}`}
                            href={`/search/person?query=${query}&page=1`}
                        >
                            <div className="flex gap-2 w-full px-4 py-2 justify-end">
                                <p>People</p>
                                <p>{props.lengths.people}</p>
                            </div>
                        </Link>
                    </li>
                    <li className="grid">
                        <Link
                            id="all"
                            className={`w-full hover:bg-slate-800 ${cat === 'multi' ? 'bg-slate-800' : 'bg-slate-600'}`}
                            href={`/search/multi?query=${query}&page=1`}
                        >
                            <div className="flex gap-2 w-full px-4 py-2 justify-end">
                                <p>All</p>
                                <p>{props.lengths.all}</p>
                            </div>
                        </Link>
                    </li>
                </>
            )}
        </ul>
    );
}
