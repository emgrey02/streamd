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
                <div className="px-4 text-center flex flex-col gap-4 items-center">
                    <p>Sign in to access your favorite tv shows & movies.</p>
                    <TmdbSignIn />
                </div>
            :   <div className="px-4 flex flex-col items-start gap-4">
                    <p>hello {username} :)</p>
                </div>
            }
            <ul>
                {movieCats.map((category: string, index: Key) => (
                    <li key={index}>
                        <Suspense fallback={<p>Loading...</p>}>
                            <ContentList content="movie" cat={category} />
                        </Suspense>
                    </li>
                ))}
            </ul>
            <ul>
                {showCats.map((category: string, index: Key) => (
                    <li key={index}>
                        <Suspense fallback={<p>Loading...</p>}>
                            <ContentList content="tv" cat={category} />
                        </Suspense>
                    </li>
                ))}
            </ul>
        </main>
    );
}
