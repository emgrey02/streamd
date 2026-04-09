'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DashNav() {
    const pathname = usePathname();
    const pathnameArray = pathname.slice(1).split('/');
    const dashPage = pathnameArray[0];
    const category =
        pathnameArray[1] || localStorage.getItem('dashCat') || 'favorites';
    console.log(dashPage, category);

    useEffect(() => {
        localStorage.setItem('dashCat', category);
    }, [category]);

    return (
        <ul className="w-full sm:w-125 grid grid-cols-4 items-start place-items-stretch mb-4 ring-1 ring-slate-900">
            <li
                className={`${category === 'favorites' ? 'bg-slate-900 border-slate-400' : 'border-slate-600'} border-s-2`}
            >
                <Link
                    className={`ps-2 grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue`}
                    href={`/${dashPage}/favorites`}
                >
                    favorites
                </Link>
            </li>
            <li
                className={`${category === 'watchlist' ? 'bg-slate-900 border-slate-400' : 'border-slate-600'} border-s-2`}
            >
                <Link
                    className={`ps-2 grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue`}
                    href={`/${dashPage}/watchlist`}
                >
                    watchlist
                </Link>
            </li>
            <li
                className={`${category === 'rated' ? 'bg-slate-900 border-slate-400' : 'border-slate-600'} border-s-2`}
            >
                <Link
                    className={`ps-2 grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue`}
                    href={`/${dashPage}/rated`}
                >
                    rated
                </Link>
            </li>
            <li
                className={`${category === 'lists' ? 'bg-slate-900 border-slate-400' : 'border-slate-600'} border-s-2`}
            >
                <Link
                    className={`ps-2 grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue`}
                    href={`/${dashPage}/lists`}
                >
                    your lists
                </Link>
            </li>
        </ul>
    );
}
