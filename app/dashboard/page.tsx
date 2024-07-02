'use server';
import ContentList from '../components/ContentList';
import BackButton from '../components/BackButton';
import { cookies } from 'next/headers';
import TmdbSignIn from '../components/TmdbSignIn';

export default async function Page() {
    const accessToken: string | undefined = cookies().get('accToken')?.value;
    const accountId: string | undefined = cookies().get('accId')?.value;
    let reqToken: string | undefined = cookies().get('reqToken')?.value;
    let username;

    async function getRequestToken() {
        let url = process.env.BASE_URL;
        const options: RequestInit = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
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
        console.log('assigning new request token');
        const resJson = await res.json();
        const reqToken = resJson.request_token;
        return reqToken;
    }

    if (!accessToken) {
        reqToken = await getRequestToken();
    } else {
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

    return (
        <main className="px-4">
            <h1 className="text-center">Your Dashboard</h1>
            <BackButton />
            {username && <p>Hello, {username}</p>}
            {accessToken ?
                <ul>
                    <li>
                        <ContentList
                            accountId={accountId}
                            content="movie"
                            cat="favorites"
                        />
                    </li>
                    <li>
                        <ContentList
                            accountId={accountId}
                            content="tv"
                            cat="favorites"
                        />
                    </li>
                    <li>
                        <ContentList
                            accountId={accountId}
                            content="movie"
                            cat="watchlist"
                        />
                    </li>
                    <li>
                        <ContentList
                            accountId={accountId}
                            content="tv"
                            cat="watchlist"
                        />
                    </li>
                </ul>
            :   <div className="text-center">
                    <p>Sign in to see your dashboard</p>
                    {reqToken && <TmdbSignIn rt={reqToken} />}
                </div>
            }
            <BackButton />
        </main>
    );
}
