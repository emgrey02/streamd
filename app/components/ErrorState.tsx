'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorState(props: {
    error: Error & { digest?: string };
    reset: () => void;
    title?: string;
}) {
    useEffect(() => {
        console.error(props.error);
    }, [props.error]);

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center py-20 px-4 grow">
            <h1 className="text-2xl sm:text-4xl font-light tracking-wider">
                {props.title || 'Something went wrong'}
            </h1>
            <p className="text-slate-400 max-w-[50ch]">
                {props.error.message || 'An unexpected error occurred.'}
            </p>
            <div className="flex gap-4 mt-2">
                <button
                    onClick={props.reset}
                    className="py-2 px-4 bg-slate-700 hover:bg-slate-900 transition border-2 border-slate-900 text-brand-blue focus:outline-none focus:ring focus:ring-brand-blue"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="py-2 px-4 hover:bg-slate-400/40 transition focus:outline-none focus:ring focus:ring-brand-blue"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}
