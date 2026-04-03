'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { capitalizeCategory } from '../utils';

export default function ListNav() {
    const pathname = usePathname();
    const pathnameArray = pathname.slice(1).split('/');
    const content = pathnameArray[0];
    const category = pathnameArray[1];
    console.log(pathnameArray);

    let categories: string[] = [];

    if (content === 'trending') {
        categories = ['all', 'movie', 'tv', 'people'];
    } else if (content === 'movies') {
        categories = ['now_playing', 'popular', 'top_rated', 'upcoming'];
    } else if (content === 'shows') {
        categories = ['airing_today', 'on_the_air', 'popular', 'top_rated'];
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-min grid gap-y-4">
                <ul
                    className={`grid ${content === 'favorite' || content === 'watchlist' || content === 'rated' ? 'grid-cols-2 max-w-100' : 'grid-cols-4 max-w-150'} items-center ring-1 ring-gray-900 bg-slate-700/40`}
                >
                    {categories?.length > 0 &&
                        categories.map((cat, index) => (
                            <li
                                key={index}
                                className={`h-full ${cat === category && 'bg-slate-900'} border-s-2 ${cat === category ? 'border-slate-400' : 'border-slate-600'} transition-all `}
                            >
                                <Link
                                    href={`/${pathnameArray[0]}/${cat == 'people' ? (cat = 'person') : cat}`}
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
