'use client';

import { useRouter } from 'next/navigation';
import { getReqToken, getTmdbSession, setSessionCookies } from '../actions';
import { useEffect } from 'react';

//user is sent to this page after authenticating with tmdb
export default function Page() {
    const url = process.env.BASE_URL;
    let router = useRouter();

    useEffect(() => {
        //get request token
        async function getTokenCookie() {
            let reqToken = await getReqToken();
            return reqToken;
        }

        //get session info w/ request token & return it
        async function getSessionInfo() {
            const reqToken = await getTokenCookie();
            if (reqToken) {
                let sessionInfo = await getTmdbSession(reqToken);
                return sessionInfo;
            } else {
                return null;
            }
        }

        async function setTheCookies() {
            let userSession = await getSessionInfo();
            setSessionCookies(userSession);
        }

        setTheCookies();
        setTimeout(() => {
            router.replace(`/`);
        }, 2000);
    }, []);

    return (
        <>
            <p className="text-center my-8">you are now signed in!</p>
            <p className="text-center">taking you home...</p>
        </>
    );
}
