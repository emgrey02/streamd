import ContentList from './components/ContentList';
import { Key, Suspense } from 'react';
import TmdbSignIn from './components/TmdbSignIn';
import TmdbSignOut from './components/TmdbSignOut';
import { cookies } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache';

export default async function Home() {
    let reqToken;
    let username;
    const accessToken = cookies().get('accToken')?.value;
    const accountId = cookies().get('accId')?.value;
    const url: string | undefined = process.env.NEXT_PUBLIC_BASE_URL;

    async function getRequestToken() {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                redirect_to: `${url}/approval`,
            }),
            next: { revalidate: 60 },
        };

        options.next as RequestInit;

        //fetch to get a request token from TMDB
        const res = await fetch(
            'https://api.themoviedb.org/4/auth/request_token',
            options
        );

        //error handling
        if (!res.ok) {
            console.error('failed to fetch data');
        }

        //assign request Token
        const resJson = await res.json();
        const reqToken = resJson.request_token;
        console.log('new reqToken: ', reqToken);
        return reqToken;
    }

    // if there is no accessToken/if user is logged out
    // then retrieve a request token in case user wants to log in
    if (!accessToken) {
        reqToken = await getRequestToken();
    } else {
        // a user is logged in
        // get username of current user
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
            },
        };

        let res = await fetch(
            `https://api.themoviedb.org/3/account/${accountId}`,
            options
        );

        if (!res.ok) {
            console.error('failed to fetch account info');
        }

        //assign username
        const accountInfo = await res.json();
        username = accountInfo.username;
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
            {!accessToken ?
                <div className="px-4">
                    <p>Sign in to access your favorite tv shows & movies.</p>
                    <TmdbSignIn rt={reqToken} />
                </div>
            :   <div className="px-4">
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
