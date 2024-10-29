'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ListNav() {
    const pathname = usePathname();
    const pathnameArray = pathname.slice(1).split('/');
    const [category, setCategory] = useState<string>();
    const [categories, setCategories] = useState<string[]>();
    console.log(pathnameArray);
    const content = pathnameArray[0];

    // 'favorite' 'movie'
    // 'trending' 'all'

    useEffect(() => {
        setContent();
    }, []);

    function capitalizeCategory(cat: string) {
        if (cat.includes('_')) {
            let array = cat.split('_');
            let firstLetterCap = array[0].slice(0, 1).toUpperCase();
            let secondLetterCap = array[1].slice(0, 1).toUpperCase();

            array[0] = firstLetterCap + array[0].slice(1);
            array[1] = secondLetterCap + array[1].slice(1);

            if (array[2]) {
                let thirdLetterCap = array[2]?.slice(0, 1).toUpperCase();
                array[2] = thirdLetterCap + array[2]?.slice(1);
            }

            return `${array.join(' ')}`;
        } else {
            let capLetter = cat.slice(0, 1).toUpperCase();
            let capCat = `${capLetter}${cat.slice(1)}`;
            if (capCat === 'Movie') capCat = 'Movies';
            if (capCat === 'Favorite') capCat = 'Favorites';
            return capCat;
        }
    }

    async function setContent() {
        if (pathnameArray[0] === 'trending') {
            setCategories(['all', 'movie', 'tv', 'people']);
            setCategory(pathnameArray[1]);
        } else if (pathnameArray[0] === 'movies') {
            setCategories(['now_playing', 'popular', 'top_rated', 'upcoming']);
            setCategory(pathnameArray[1]);
        } else if (pathnameArray[0] === 'shows') {
            setCategories([
                'airing_today',
                'on_the_air',
                'popular',
                'top_rated',
            ]);
            setCategory(pathnameArray[1]);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-min grid gap-y-4">
                <ul
                    className={`grid ${content === 'favorite' || content === 'watchlist' || content === 'rated' ? 'grid-cols-2 max-w-[400px]' : 'grid-cols-4 max-w-[600px]'} items-center ring-1 ring-gray-900 bg-slate-700/40`}
                >
                    {categories?.map((cat, index) => (
                        <li
                            key={index}
                            className={`h-full ${cat === category && 'bg-slate-900'} border-s-2 ${cat === category ? 'border-slate-400' : 'border-slate-600'} transition-all `}
                        >
                            <Link
                                href={`/${pathnameArray[0]}/${cat}`}
                                className={`grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue`}
                            >
                                {capitalizeCategory(cat)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
