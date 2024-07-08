import ContentList from './components/ContentList';
import { Key, Suspense } from 'react';
import TmdbSignIn from './components/TmdbSignIn';
import { cookies } from 'next/headers';

export default async function Home() {
    const sessionId = cookies().get('sessionId')?.value;
    const username = cookies().get('username')?.value;
    console.log('sessionId: ', sessionId);

    let movieCats: string[] = [
        'now_playing',
        'popular',
        'top_rated',
        'upcoming',
    ];

    let showCats: string[] = [
        'airing_today',
        'on_the_air',
        'popular',
        'top_rated',
    ];

    return (
        <main className="min-h-screen py-4">
            {!sessionId ?
                <div className="px-4 text-center flex flex-col gap-4 items-center my-8">
                    <p>Sign in to access your favorite tv shows & movies.</p>
                    <TmdbSignIn />
                </div>
            :   <div className="px-4 flex flex-col items-start my-8">
                    <p>Hello, {username}. Please, have a look around.</p>
                    <p>
                        *Go to your dashboard to see your personal favorites,
                        watchlists, and rated tv shows/movies.
                    </p>
                </div>
            }
            <ul className="grid gap-4">
                {movieCats.map((category: string, index: Key) => (
                    <li key={index}>
                        <Suspense
                            fallback={
                                <p className="h-60 grid place-items-center">
                                    Loading...
                                </p>
                            }
                        >
                            <ContentList content="movie" cat={category} />
                        </Suspense>
                    </li>
                ))}
            </ul>
            <ul className="grid gap-4">
                {showCats.map((category: string, index: Key) => (
                    <li key={index}>
                        <Suspense
                            fallback={
                                <p className="h-60 grid place-items-center">
                                    Loading...
                                </p>
                            }
                        >
                            <ContentList content="tv" cat={category} />
                        </Suspense>
                    </li>
                ))}
            </ul>
        </main>
    );
}
