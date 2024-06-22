import { redirect } from 'next/navigation';
import MovieList from './components/MovieList';
import { Key } from 'react';

export default async function Home() {
    //if user has logged in with stytch

    //if user hasn't been authenticated with tmdb

    //create options object for fetch call
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            redirect_to: 'http://localhost:3000/approval',
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
    const reqToken = resJson.request_token;

    //use the request token we got and add it to the user's public metadata

    //send user to tmdb to authenticate
    // redirect(
    //     `https://www.themoviedb.org/auth/access?request_token=${reqToken}`
    // );

    let movieCats: string[] = [
        'now_playing',
        'popular',
        'top_rated',
        'upcoming',
    ];

    return (
        <main className="min-h-screen">
            <h1>streamie</h1>
            {userId ?
                <p>Hello, {user?.fullName}</p>
            :   <p>sign in to access your favorite tv shows & movies!</p>}
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
