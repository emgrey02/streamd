'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SearchResNavProps {
    keyword?: string;
    genre?: string;
    query: string;
    lengths: { movie: string; tv: string; people: string; all: string };
}

export default function SearchResNav({
    keyword,
    genre,
    query,
    lengths,
}: SearchResNavProps) {
    const pathname = usePathname();
    const pathnameArray = pathname.slice(1).split('/');
    let cat = pathnameArray[1];

    if (genre || keyword) {
        cat = pathnameArray[1].split('-')[1];
    }

    return (
        <ul
            className={`w-37.5 h-min grid ${keyword || genre ? 'grid-row-2' : 'grid-rows-4'} bg-slate-950 mb-4`}
        >
            <li className="grid">
                <Link
                    id="movies"
                    className={`w-full hover:bg-slate-800 ${cat === 'movie' ? 'bg-slate-800' : 'bg-slate-600'}`}
                    href={
                        keyword ? `/search/keyword-movie?query=${query}&page=1`
                        : genre ?
                            `/search/genre-movie?query=${encodeURIComponent(query)}&page=1`
                        :   `/search/movie?query=${query}&page=1`
                    }
                >
                    <div className="flex gap-2 w-full px-4 py-2 justify-end ">
                        <p>Movies</p>
                        <p>{lengths.movie}</p>
                    </div>
                </Link>
            </li>
            <li className="grid">
                <Link
                    id="tv"
                    className={`w-full hover:bg-slate-800 ${cat === 'tv' ? 'bg-slate-800' : 'bg-slate-600'}`}
                    href={
                        keyword ? `/search/keyword-tv?query=${query}&page=1`
                        : genre ?
                            `/search/genre-tv?query=${encodeURIComponent(query)}&page=1`
                        :   `/search/tv?query=${query}&page=1`
                    }
                >
                    <div className="flex gap-2 w-full px-4 py-2 justify-end">
                        <p>Tv</p>
                        <p>{lengths.tv}</p>
                    </div>
                </Link>
            </li>
            {!keyword && !genre && (
                <>
                    <li className="grid">
                        <Link
                            id="people"
                            className={`w-full hover:bg-slate-800 ${cat === 'person' ? 'bg-slate-800' : 'bg-slate-600'}`}
                            href={`/search/person?query=${query}&page=1`}
                        >
                            <div className="flex gap-2 w-full px-4 py-2 justify-end">
                                <p>People</p>
                                <p>{lengths.people}</p>
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
                                <p>{lengths.all}</p>
                            </div>
                        </Link>
                    </li>
                </>
            )}
        </ul>
    );
}
