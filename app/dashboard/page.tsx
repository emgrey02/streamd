'use server';
import ContentList from '../components/ContentList';
import BackButton from '../components/BackButton';
import { cookies } from 'next/headers';
import TmdbSignIn from '../components/TmdbSignIn';

export default async function Page() {
    const sessionId: string | undefined = cookies().get('sessionId')?.value;
    const accountId: string | undefined = cookies().get('accId')?.value;
    const username: string | undefined = cookies().get('username')?.value;
    let reqToken;

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

    if (!sessionId) {
        reqToken = await getRequestToken();
    }

    return (
        <main className="px-4">
            <h1 className="text-center">Your Dashboard</h1>
            <BackButton />
            {username && <p>Hello, {username}</p>}
            {sessionId ?
                <ul>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="movies"
                            cat="favorite"
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="tv"
                            cat="favorite"
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="movies"
                            cat="watchlist"
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="tv"
                            cat="watchlist"
                        />
                    </li>
                </ul>
            :   <div className="text-center flex flex-col items-center justify-center gap-4 h-96">
                    <p>Sign in to see your dashboard</p>
                    <TmdbSignIn rt={reqToken} />
                </div>
            }
            <BackButton />
        </main>
    );
}
