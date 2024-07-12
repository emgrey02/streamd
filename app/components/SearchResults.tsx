'use client';

import { useEffect, useState } from 'react';
import Card from './Card';
import BackButton from './BackButton';
import Link from 'next/link';
import Pagination from './Pagination';
import LargeCreditsList from './LargeCreditsList';
import SearchBar from './SearchBar';

export default function SearchResults(props: {
    data: any;
    lengths: { movie: string; tv: string; people: any; all: any };
    query: string;
    cat: string;
}) {
    const [page, setPage] = useState(1);
    const [res, setResults] = useState<any>();

    console.log(props.data);
    console.log(props.cat);

    useEffect(() => {
        console.log(props.data.results);
        setResults(props.data.results);
        setPage(props.data.page);
    }, [props.data.results, props.data.page]);

    return (
        <main>
            <BackButton />
            <SearchBar />
            <Pagination
                page={props.data.page}
                totalPages={props.data.total_pages}
                cat={props.cat}
                query={props.query}
                search={true}
            />
            <div className="flex flex-col m-2 md:m-4 md:flex-row md:gap-8 ">
                <ul className="w-[150px] h-min grid grid-rows-4 bg-slate-950">
                    <li className="grid">
                        <Link
                            id="movies"
                            className={`w-full hover:bg-slate-800 ${props.cat === 'movie' ? 'bg-slate-800' : 'bg-slate-600'}`}
                            href={`/search/movie?query=${props.query}&page=1`}
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
                            className={`w-full hover:bg-slate-800 ${props.cat === 'tv' ? 'bg-slate-800' : 'bg-slate-600'}`}
                            href={`/search/tv?query=${props.query}&page=1`}
                        >
                            <div className="flex gap-2 w-full px-4 py-2 justify-end">
                                <p>Tv</p>
                                <p>{props.lengths.tv}</p>
                            </div>
                        </Link>
                    </li>
                    <li className="grid">
                        <Link
                            id="people"
                            className={`w-full hover:bg-slate-800 ${props.cat === 'person' ? 'bg-slate-800' : 'bg-slate-600'}`}
                            href={`/search/person?query=${props.query}&page=1`}
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
                            className={`w-full hover:bg-slate-800 ${props.cat === 'multi' ? 'bg-slate-800' : 'bg-slate-600'}`}
                            href={`/search/multi?query=${props.query}&page=1`}
                        >
                            <div className="flex gap-2 w-full px-4 py-2 justify-end">
                                <p>All</p>
                                <p>{props.lengths.all}</p>
                            </div>
                        </Link>
                    </li>
                </ul>

                {res && (
                    <LargeCreditsList
                        data={res}
                        type={props.cat}
                        search={true}
                        credits={false}
                        fwr={false}
                    />
                )}
            </div>
            <Pagination
                page={props.data.page}
                totalPages={props.data.total_pages}
                cat={props.cat}
                query={props.query}
                search={true}
            />
        </main>
    );
}
