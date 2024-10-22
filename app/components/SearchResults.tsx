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
    keyword: boolean;
    genre: boolean;
}) {
    const [page, setPage] = useState(1);
    const [res, setResults] = useState<any>();

    console.log(props.data);
    console.log(props.cat);
    console.log(props.keyword);
    console.log(props.query);

    useEffect(() => {
        console.log(props.data.results);
        setResults(props.data.results);
        setPage(props.data.page);
    }, [props.data.results, props.data.page]);

    return (
        <div className="flex flex-col gap-8 my-8">
            <SearchBar
                searchTerm={
                    props.keyword || props.genre ?
                        ''
                    :   props.query.split('-')[0]
                }
            />
            <Pagination
                page={props.data.page}
                totalPages={props.data.total_pages}
                cat={props.cat}
                query={props.query}
                search={true}
                keyword={props.keyword}
                genre={props.genre}
            />
            <div className="flex flex-col m-2 md:m-4 md:flex-row md:gap-8 ">
                <ul
                    className={`w-[150px] h-min grid ${props.keyword || props.genre ? 'grid-row-2' : 'grid-rows-4'} bg-slate-950 mb-4`}
                >
                    <li className="grid">
                        <Link
                            id="movies"
                            className={`w-full hover:bg-slate-800 ${props.cat === 'movie' ? 'bg-slate-800' : 'bg-slate-600'}`}
                            href={
                                props.keyword ?
                                    `/search/keyword-movie?query=${props.query}&page=1`
                                : props.genre ?
                                    `/search/genre-movie?query=${encodeURIComponent(props.query)}&page=1`
                                :   `/search/movie?query=${props.query}&page=1`
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
                            className={`w-full hover:bg-slate-800 ${props.cat === 'tv' ? 'bg-slate-800' : 'bg-slate-600'}`}
                            href={
                                props.keyword ?
                                    `/search/keyword-tv?query=${props.query}&page=1`
                                : props.genre ?
                                    `/search/genre-tv?query=${encodeURIComponent(props.query)}&page=1`
                                :   `/search/tv?query=${props.query}&page=1`
                            }
                        >
                            <div className="flex gap-2 w-full px-4 py-2 justify-end">
                                <p>Tv</p>
                                <p>{props.lengths.tv}</p>
                            </div>
                        </Link>
                    </li>
                    {props.keyword || props.genre || (
                        <>
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
                        </>
                    )}
                </ul>

                {res && (
                    <div className="@container w-full">
                        <LargeCreditsList
                            data={res}
                            type={props.cat}
                            search={true}
                            credits={false}
                            fwr={false}
                            seasons={false}
                        />
                    </div>
                )}
            </div>
            <Pagination
                page={props.data.page}
                totalPages={props.data.total_pages}
                cat={props.cat}
                query={props.query}
                search={true}
                keyword={props.keyword}
                genre={props.genre}
            />
        </div>
    );
}
