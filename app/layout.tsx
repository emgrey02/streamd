import { Exo } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import TmdbSignIn from './components/TmdbSignIn';
import TmdbSignOut from './components/TmdbSignOut';

//Mina weight: ['400', '700'],
const inter = Exo({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        template: '%s | streamd',
        default: 'streamd',
    },
    description:
        'A source for movies, tv shows, and celebrities. See ratings, reviews, and where to watch your favorite movies and tv shows. Save movies and tv shows to your favorites, watchlist, or create your own custom lists.',
    generator: 'Next.js',
    applicationName: 'streamd',
    referrer: 'origin-when-cross-origin',
    keywords: ['movies', 'shows', 'actors'],
    authors: [{ name: 'Emma', url: 'https://emmagrey.netlify.app' }],
    creator: 'Emma Grey',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    const username = cookieStore.get('username')?.value;

    return (
        <html lang="en scroll-auto">
            <body
                className={`${inter.className} w-full h-full relative bg-slate-800 text-gray-300 flex flex-col items-center`}
            >
                <div
                    className={`min-h-svh max-w-7xl flex flex-col w-full h-full`}
                >
                    <nav
                        aria-label="primary navigation"
                        className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-full py-2 px-4 "
                    >
                        <h1 className="font-bold text-lg text-brand-blue tracking-widest">
                            <Link href="/">streamd</Link>
                        </h1>
                        <ul className="flex flex-wrap gap-y-6 m-4 w-full py-4 sm:w-fit justify-center sm:m-0 gap-4 text-center">
                            <li>
                                <Link
                                    className="underline underline-offset-1 hover:underline-offset-4 transition-all"
                                    href="/movies/now_playing"
                                >
                                    movies
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="underline underline-offset-1 hover:underline-offset-4 transition-all"
                                    href="/shows/airing_today"
                                >
                                    shows
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="underline underline-offset-1 hover:underline-offset-4 transition-all"
                                    href="/trending/people"
                                >
                                    people
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <nav
                        aria-label="secondary navigation"
                        className={`flex justify-between items-center w-full h-fit mb-8 sm:py-4 px-4 bg-slate-700/50`}
                    >
                        <div>
                            {sessionId && username ?
                                <div>
                                    <p>hello {username}!</p>
                                </div>
                            :   <div>
                                    <p>
                                        Sign in to save movies/tv to your own
                                        lists, favorites, or watchlist.
                                    </p>
                                </div>
                            }
                        </div>
                        <ul
                            className={`flex flex-wrap gap-y-6 m-4 w-fit sm:m-0 gap-4`}
                        >
                            <li>
                                <Link
                                    className="hover:bg-slate-900 bg-slate-700/40 ring-1 ring-gray-900 px-2 py-2 text-brand-blue transition"
                                    href="/dashboard/"
                                >
                                    dashboard
                                </Link>
                            </li>
                            <li>
                                {sessionId ?
                                    <TmdbSignOut />
                                :   <TmdbSignIn />}
                            </li>
                        </ul>
                    </nav>
                    {children}
                </div>
                <footer className="flex flex-col self-stretch left-0 bottom-0 right-0 text-slate-300 items-center gap-4 mt-2 pt-20 pb-20 bg-slate-900/80">
                    <svg
                        width="150"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 273.42 35.52"
                    >
                        <defs>
                            <linearGradient
                                id="linear-gradient"
                                y1="17.76"
                                x2="273.42"
                                y2="17.76"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0" stopColor="#90cea1" />
                                <stop offset="0.56" stopColor="#3cbec9" />
                                <stop offset="1" stopColor="#00b3e5" />
                            </linearGradient>
                        </defs>
                        <title>TMDB logo</title>
                        <g id="Layer_2" data-name="Layer 2">
                            <g id="Layer_1-2" data-name="Layer 1">
                                <path
                                    className="fill-[url(#linear-gradient)]"
                                    d="M191.85,35.37h63.9A17.67,17.67,0,0,0,273.42,17.7h0A17.67,17.67,0,0,0,255.75,0h-63.9A17.67,17.67,0,0,0,174.18,17.7h0A17.67,17.67,0,0,0,191.85,35.37ZM10.1,35.42h7.8V6.92H28V0H0v6.9H10.1Zm28.1,0H46V8.25h.1L55.05,35.4h6L70.3,8.25h.1V35.4h7.8V0H66.45l-8.2,23.1h-.1L50,0H38.2ZM89.14.12h11.7a33.56,33.56,0,0,1,8.08,1,18.52,18.52,0,0,1,6.67,3.08,15.09,15.09,0,0,1,4.53,5.52,18.5,18.5,0,0,1,1.67,8.25,16.91,16.91,0,0,1-1.62,7.58,16.3,16.3,0,0,1-4.38,5.5,19.24,19.24,0,0,1-6.35,3.37,24.53,24.53,0,0,1-7.55,1.15H89.14Zm7.8,28.2h4a21.66,21.66,0,0,0,5-.55A10.58,10.58,0,0,0,110,26a8.73,8.73,0,0,0,2.68-3.35,11.9,11.9,0,0,0,1-5.08,9.87,9.87,0,0,0-1-4.52,9.17,9.17,0,0,0-2.63-3.18A11.61,11.61,0,0,0,106.22,8a17.06,17.06,0,0,0-4.68-.63h-4.6ZM133.09.12h13.2a32.87,32.87,0,0,1,4.63.33,12.66,12.66,0,0,1,4.17,1.3,7.94,7.94,0,0,1,3,2.72,8.34,8.34,0,0,1,1.15,4.65,7.48,7.48,0,0,1-1.67,5,9.13,9.13,0,0,1-4.43,2.82V17a10.28,10.28,0,0,1,3.18,1,8.51,8.51,0,0,1,2.45,1.85,7.79,7.79,0,0,1,1.57,2.62,9.16,9.16,0,0,1,.55,3.2,8.52,8.52,0,0,1-1.2,4.68,9.32,9.32,0,0,1-3.1,3A13.38,13.38,0,0,1,152.32,35a22.5,22.5,0,0,1-4.73.5h-14.5Zm7.8,14.15h5.65a7.65,7.65,0,0,0,1.78-.2,4.78,4.78,0,0,0,1.57-.65,3.43,3.43,0,0,0,1.13-1.2,3.63,3.63,0,0,0,.42-1.8A3.3,3.3,0,0,0,151,8.6a3.42,3.42,0,0,0-1.23-1.13A6.07,6.07,0,0,0,148,6.9a9.9,9.9,0,0,0-1.85-.18h-5.3Zm0,14.65h7a8.27,8.27,0,0,0,1.83-.2,4.67,4.67,0,0,0,1.67-.7,3.93,3.93,0,0,0,1.23-1.3,3.8,3.8,0,0,0,.47-1.95,3.16,3.16,0,0,0-.62-2,4,4,0,0,0-1.58-1.18,8.23,8.23,0,0,0-2-.55,15.12,15.12,0,0,0-2.05-.15h-5.9Z"
                                />
                            </g>
                        </g>
                    </svg>
                    <p className="text-center">
                        this product uses the TMDB API but is not endorsed or
                        certified by TMDB
                    </p>
                    <p>designed & developed by emma grey</p>
                    <p>&copy; 2024</p>
                </footer>
            </body>
        </html>
    );
}
