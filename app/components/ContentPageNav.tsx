'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ContentPageNav() {
    const [currentPage, setCurrentPage] = useState('info');
    const pathname = usePathname();
    const pathnameArray = pathname.slice(1).split('/');
    const mediaType = pathnameArray[0];
    const showId = pathnameArray[1];

    useEffect(() => {
        const pathnameArray = pathname.slice(1).split('/');
        const currentPage = pathnameArray[2];
        localStorage.setItem('currentPage', currentPage);
        console.log(currentPage);
        if (!currentPage) {
            setCurrentPage('info');
        } else {
            setCurrentPage(currentPage);
        }
    }, [pathname]);

    return (
        <nav aria-label="secondary navigation">
            <ul
                className={`grid ${mediaType === 'person' ? 'grid-cols-2 max-w-[400px]' : 'grid-cols-3 max-w-[400px]'} ${mediaType === 'tv' && 'grid-cols-4 max-w-[600px]'} items-center my-8 ring-1 ring-gray-900 bg-slate-700/40`}
            >
                <li
                    className={`${currentPage === 'info' ? 'bg-slate-900 border-slate-400' : 'border-slate-600'} border-s-2`}
                >
                    <Link
                        className="grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue"
                        href={`/${mediaType}/${showId}`}
                        replace
                    >
                        Info
                    </Link>
                </li>
                <li
                    className={`${currentPage === 'credits' ? 'bg-slate-900 border-slate-400 ' : 'border-slate-600'} border-s-2`}
                >
                    <Link
                        className="grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue"
                        href={`/${mediaType}/${showId}/credits`}
                        replace
                    >
                        Credits
                    </Link>
                </li>
                {mediaType === 'person' || (
                    <li
                        className={`${currentPage === 'reviews' ? 'bg-slate-900 border-slate-400 ' : 'border-slate-600'} border-s-2 `}
                    >
                        <Link
                            className="grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue"
                            href={`/${mediaType}/${showId}/reviews`}
                            replace
                        >
                            Reviews
                        </Link>
                    </li>
                )}
                {mediaType === 'tv' && (
                    <li
                        className={`${currentPage === 'seasons' || currentPage === 'season' ? 'bg-slate-900 border-slate-400 ' : 'border-slate-600'} border-s-2 `}
                    >
                        <Link
                            className="grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue"
                            href={`/${mediaType}/${showId}/seasons`}
                            replace
                        >
                            Seasons
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
