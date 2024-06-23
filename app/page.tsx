import { kv } from '@vercel/kv';
import MovieList from './components/MovieList';
import { Key } from 'react';
import TmdbSignIn from './components/TmdbSignIn';

export default async function Home() {
    const userSession: UserSession | null = await kv.get('userSession');
    const accessToken: string | undefined = userSession?.access_token;

    const url: string | undefined = process.env.BASE_URL;

    //if user hasn't been authenticated with tmdb
    if (!accessToken && url) {
        //create options object for fetch call
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                redirect_to: `${url}/approval`,
            }),
        };

        //fetch to get a request token from TMDB
        const res = await fetch(
            'https://api.themoviedb.org/4/auth/request_token',
            options
        );

        //error handling
        if (!res.ok) {
            throw new Error('failed to fetch data');
        }

        //assign request Token
        const resJson = await res.json();
        const reqToken: string = resJson.request_token;

        //use the request token we got and add it to the kv database
        await kv.set('reqToken', reqToken);
    }

    let movieCats: string[] = [
        'now_playing',
        'popular',
        'top_rated',
        'upcoming',
    ];

    //get request token that we just assigned
    const reqToken: string | null = await kv.get('reqToken');

    return (
        <main className="min-h-screen">
            <h1>streamie</h1>
            {!accessToken && reqToken !== null && (
                <>
                    <p>Hello</p>
                    <p>sign in to access your favorite tv shows & movies!</p>
                    <TmdbSignIn rt={reqToken} />
                </>
            )}
            <ul>
                {movieCats.map((category: string, index: Key) => (
                    <li key={index}>
                        <MovieList cat={category} />
                    </li>
                ))}
            </ul>
        </main>
    );
}
