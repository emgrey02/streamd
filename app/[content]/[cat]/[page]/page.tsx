import Image from 'next/image';
import { Key } from 'react';
import Link from 'next/link';

interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export default async function Page({
    params,
}: {
    params: { content: string; cat: string; page: string };
}) {
    let capCat;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/${params.content}/${params.cat}?language=en-US&page=${params.page}`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie/show category');
    }

    const cont = await res.json();
    const totalPages = cont.total_pages;

    //capitalize category
    if (params.cat.includes('_')) {
        let array = params.cat.split('_');
        let firstLetterCap = array[0].slice(0, 1).toUpperCase();
        let secondLetterCap = array[1].slice(0, 1).toUpperCase();
        array[0] = firstLetterCap + array[0].slice(1);
        array[1] = secondLetterCap + array[1].slice(1);
        capCat = `${params.content === 'movie' ? 'Movies' : 'TV'}: ${array.join(' ')}`;
    } else {
        let capLetter = params.cat.slice(0, 1).toUpperCase();
        if (params.cat === 'favorites') {
            capCat = capLetter + params.cat.slice(1, -1);
            if (params.content === 'movie') {
                capCat = capCat + ' ' + params.content + 's';
            } else {
                capCat = capCat + ' ' + params.content + ' shows';
            }
        } else if (params.cat === 'watchlist') {
            capCat = capLetter + params.cat.slice(1);
            let capLetterCont = params.content.slice(0, 1).toUpperCase();
            capCat = capLetterCont + params.content.slice(1) + ' ' + capCat;
        } else {
            capCat = `${params.content === 'movie' ? 'Movies' : 'TV'}: ${capLetter}${params.cat.slice(1)}`;
        }
    }

    return (
        <>
            <h1 className="font-medium text-center">{capCat}</h1>
            <div className="grid grid-cols-2 px-4 py-8">
                {+params.page > 1 && (
                    <Link
                        className="col-start-1"
                        href={`/${params.content}/${params.cat}/${+params.page - 1}`}
                    >
                        Previous
                    </Link>
                )}
                {+params.page < totalPages && (
                    <Link
                        className="col-start-2 justify-self-end"
                        href={`/${params.content}/${params.cat}/${+params.page + 1}`}
                    >
                        Next
                    </Link>
                )}
            </div>
            {cont && cont.results.length >= 1 && (
                <ul
                    id="scroll-cont"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 place-items-center gap-y-16"
                >
                    {cont.results.map(
                        (m: any, index: Key | null | undefined) => (
                            <li
                                data-num={index}
                                className="min-w-56 grid px-2 place-content-center place-items-center"
                                key={index}
                            >
                                <Link
                                    href={`/${params.content}/${m.id.toString()}`}
                                >
                                    {m.poster_path ?
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                                            alt={
                                                params.content === 'tv' ?
                                                    m.name + ' poster'
                                                :   m.title + ' poster'
                                            }
                                            width={200}
                                            height={300}
                                        />
                                    :   <div className="w-48 h-72 grid place-items-center text-center bg-slate-300/20">
                                            {params.content === 'tv' ?
                                                m.name
                                            :   m.title}{' '}
                                            poster unavailable
                                        </div>
                                    }
                                </Link>
                            </li>
                        )
                    )}
                </ul>
            )}
            <div className="grid grid-cols-2 px-4 py-8">
                {+params.page > 1 && (
                    <Link
                        className="col-start-1"
                        href={`/${params.content}/${params.cat}/${+params.page - 1}`}
                    >
                        Previous
                    </Link>
                )}
                {+params.page < totalPages && (
                    <Link
                        className="col-start-2 justify-self-end"
                        href={`/${params.content}/${params.cat}/${+params.page + 1}`}
                    >
                        Next
                    </Link>
                )}
            </div>
        </>
    );
}
