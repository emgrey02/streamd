import { kv } from '@vercel/kv';
import ContentList from './components/ContentList';
import { Key } from 'react';
import TmdbSignIn from './components/TmdbSignIn';
import TmdbSignOut from './components/TmdbSignOut';
import { cookies } from 'next/headers';
import Cryptr from 'cryptr';
import { setReqToken } from './actions';
import { unstable_noStore as noStore } from 'next/cache';
import { access } from 'fs';

export default async function Home() {
    noStore();
    const cryptr = new Cryptr('token');
    let reqToken;

    const accessToken = cookies().get('accToken')?.value;
    console.log('access token is: ', accessToken);
    // async function getSessionData() {
    //     const encryptedUserSession = cookies().get('userSession')?.value;
    //     console.log(encryptedUserSession);
    //     return encryptedUserSession ?
    //             JSON.parse(cryptr.decrypt(encryptedUserSession))
    //         :   null;
    // }

    // const userSession: UserSession | null = await kv.get('userSession');
    // const accessToken: string | undefined = userSession?.access_token;

    // const userSession: UserSession | null = await getSessionData();
    // console.log(userSession);
    // const accessToken: string | undefined = userSession?.access_token;
    // console.log(accessToken);

    const url: string | undefined = process.env.BASE_URL;

    //if user hasn't been authenticated with tmdb

    // console.log('not authenticated');
    //create options object for fetch call

    async function getRequestToken() {
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
        const resJson = await res.json();
        const reqToken = resJson.request_token;
        return reqToken;
    }

    if (!accessToken) {
        reqToken = await getRequestToken();
    }

    // use the request token we got and add it to the kv database
    // await kv.set('reqToken', reqToken);
    // } else {
    //     //get username of current user
    //     const accountId = userSession?.account_id;

    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             accept: 'application/json',
    //             Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
    //         },
    //     };

    //     let res = await fetch(
    //         `https://api.themoviedb.org/3/account/${accountId}`,
    //         options
    //     );

    //     if (!res.ok) {
    //         console.error('failed to fetch account info');
    //     }

    //     //assign username
    //     const accountInfo = await res.json();
    //     const username = accountInfo.username;
    //     // await kv.set('username', username);
    //     // cookies().set('username', username);
    // }

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

    //get request token that we just assigned
    // const reqToken: string | null = await kv.get('reqToken');
    // let reqTokenRes = await fetch(`${process.env.BASE_URL}/api`, {
    //     method: 'GET',
    //     headers: {
    //         accept: 'application/json',
    //     },
    // });

    // let fullRes = await reqTokenRes.json();
    // console.log(fullRes);

    // let reqToken = cookies().get('reqToken')?.value;

    //get username
    // const username: string | null = await kv.get('username');
    // const username: string | undefined = cookies().get('username')?.value;

    return (
        <main className="min-h-screen py-4">
            {!accessToken ?
                <div className="px-4">
                    <p>Sign in to access your favorite tv shows & movies.</p>
                    <TmdbSignIn rt={reqToken} />
                </div>
            :   <div className="px-4">
                    <p>Hello!</p>
                    <TmdbSignOut />
                </div>
            }
            <ul>
                {movieCats.map((category: string, index: Key) => (
                    <li key={index}>
                        <ContentList content="movie" cat={category} />
                    </li>
                ))}
            </ul>
            <ul>
                {showCats.map((category: string, index: Key) => (
                    <li key={index}>
                        <ContentList content="tv" cat={category} />
                    </li>
                ))}
            </ul>
        </main>
    );
}
