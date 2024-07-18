'use client';
import { useEffect, useState } from 'react';

export default function ContentPageNav(props: {
    setIt: any;
    currentTitle: string;
    person?: boolean;
    tv?: boolean;
}) {
    const [currentPage, setCurrentPage] = useState('info');

    useEffect(() => {
        setCurrentPage(props.currentTitle);
    }, [props.currentTitle]);

    return (
        <nav className="w-fit">
            <ul
                className={`grid ${props.person ? 'grid-cols-2' : 'grid-cols-3'} ${props.tv && 'grid-cols-4'} my-8 w-fit ring-1 ring-gray-900 bg-slate-700/40`}
            >
                <li
                    className={`${currentPage === 'info' ? 'bg-slate-900 border-slate-400 ' : 'border-slate-600'} border-l-4 `}
                >
                    <button
                        className="py-4 ps-3 pe-4 flex w-full"
                        onClick={() => {
                            setCurrentPage('info');
                            props.setIt('info');
                        }}
                    >
                        Info
                    </button>
                </li>
                <li
                    className={`${currentPage === 'credits' ? 'bg-slate-900 border-slate-400 ' : 'border-slate-600'} border-l-4`}
                >
                    <button
                        className="py-4 ps-3 pe-4 flex w-full"
                        onClick={() => {
                            setCurrentPage('credits');
                            props.setIt('credits');
                        }}
                    >
                        Credits
                    </button>
                </li>
                {props.person || (
                    <li
                        className={`${currentPage === 'reviews' ? 'bg-slate-900 border-slate-400 ' : 'border-slate-600'} border-l-4 pe-4`}
                    >
                        <button
                            className="py-4 ps-3 pe-4 flex w-full"
                            onClick={() => {
                                setCurrentPage('reviews');
                                props.setIt('reviews');
                            }}
                        >
                            Reviews
                        </button>
                    </li>
                )}
                {props.tv && (
                    <li
                        className={`${currentPage === 'seasons' ? 'bg-slate-900 border-slate-400 ' : 'border-slate-600'} border-l-4 pe-4`}
                    >
                        <button
                            className="py-4 ps-3 pe-4 flex w-full"
                            onClick={() => {
                                setCurrentPage('seasons');
                                props.setIt('seasons');
                            }}
                        >
                            Seasons
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
