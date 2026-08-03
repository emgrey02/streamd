'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="bg-slate-800 text-gray-300 min-h-svh grid place-items-center px-4">
                <div className="flex flex-col items-center gap-4 text-center py-20">
                    <h1 className="text-2xl sm:text-4xl font-light tracking-wider">
                        Something went wrong
                    </h1>
                    <p className="text-slate-400 max-w-[50ch]">
                        {error.message || 'An unexpected error occurred.'}
                    </p>
                    <button
                        onClick={reset}
                        className="py-2 px-4 bg-slate-700 hover:bg-slate-900 transition border-2 border-slate-900 text-brand-blue focus:outline-none focus:ring focus:ring-brand-blue"
                    >
                        Try again
                    </button>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- replaces the root layout, so router context isn't guaranteed to be mounted */}
                    <a
                        href="/"
                        className="py-2 px-4 hover:bg-slate-400/40 transition focus:outline-none focus:ring focus:ring-brand-blue"
                    >
                        Go home
                    </a>
                </div>
            </body>
        </html>
    );
}
