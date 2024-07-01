'use client';

import { getReqToken, getTmdbSession, setSessionCookies } from '../actions';
import { useEffect } from 'react';

//user is sent to this page after authenticating with tmdb
export default async function Page() {
    const url = process.env.BASE_URL;

    useEffect(() => {
        //get request token
        // const reqToken = await kv.get('reqToken');
        async function getTokenCookie() {
            let reqToken = await getReqToken();
            return reqToken;
        }

        // const reqToken = cookies().get('reqToken')?.value;
        // console.log('reqToken post approval:', reqToken);

        //get session_id & return it
        async function getSessionInfo() {
            const reqToken = await getTokenCookie();
            let sessionInfo = await getTmdbSession(reqToken);
            return sessionInfo;
        }

        async function setTheCookies() {
            let userSession = await getSessionInfo();
            setSessionCookies(userSession);
        }

        setTheCookies();
    }, []);

    return <p>you are now signed in!</p>;
}
