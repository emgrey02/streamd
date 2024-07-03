import ContentList from './components/ContentList';
import { Key, Suspense } from 'react';
import TmdbSignIn from './components/TmdbSignIn';
import TmdbSignOut from './components/TmdbSignOut';
import { cookies } from 'next/headers';
import { setAccountIdCookie } from './actions';

export default async function Home() {
    let reqToken = cookies().get('reqToken')?.value;
    const sessionId = cookies().get('sessionId')?.value;
    const username = cookies().get('username')?.value;
    console.log('sessionId: ', sessionId);

    //madstronaut
    //nastygurl
    // 66849350052b6585261b9b63

    async function getRequestToken() {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
            },
            next: { revalidate: 60 },
        };

        options.next as RequestInit;

        //fetch to get a request token from TMDB
        const res = await fetch(
            'https://api.themoviedb.org/3/authentication/token/new',
            options
        );

        //error handling
        if (!res.ok) {
            console.error('failed to fetch request token from tmdb');
        }

        //assign request Token
        const resJson = await res.json();
        const reqToken = resJson.request_token;
        console.log('got request token');
        console.log(resJson);
        return reqToken;
    }

    // if there is no sessionId/if user is logged out
    // then retrieve a request token in case user wants to log in
    if (!sessionId) {
        reqToken = await getRequestToken();
    }

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
                    <TmdbSignIn rt={reqToken} />
                </div>
            :   <div className="px-4 flex flex-col items-start gap-4">
                    <p>Hello, {username} :)</p>
                    <TmdbSignOut />
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
