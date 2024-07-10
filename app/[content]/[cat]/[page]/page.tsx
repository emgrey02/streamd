import Image from 'next/image';
import { Key } from 'react';
import Link from 'next/link';
import LargeCreditsList from '@/app/components/LargeCreditsList';

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
        `https://api.themoviedb.org/3/${params.content}/${params.cat === 'people' ? 'person' : params.cat}${params.content === 'trending' ? '/day' : ''}?language=en-US&page=${params.page}`,
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
        capCat = `${array.join(' ')}`;
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
            capCat = `${capLetter}${params.cat.slice(1)}`;
        }
    }

    return (
        <main className="mx-4 my-8">
            <h1 className="font-medium text-center">
                {capCat}{' '}
                {params.content === 'movie' ? 'Movies' : params.content}
            </h1>
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
            <LargeCreditsList credits={cont.results} type="multi" />
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
        </main>
    );
}
