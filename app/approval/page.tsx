'use client';

import { useRouter } from 'next/navigation';
import {
    getReqTokenCookie,
    createTmdbSession,
    setSessionCookies,
    getUserInfo,
} from '../actions';
import { useEffect } from 'react';

//user is sent to this page after authenticating with tmdb
export default function Page() {
    let router = useRouter();

    useEffect(() => {
        //get request token stored in cookie
        async function getTokenCookie() {
            let reqToken = await getReqTokenCookie();
            console.log(reqToken);
            return reqToken;
        }

        //get access Token & other session info w/ this request token & return it
        async function getSessionId() {
            const reqToken = await getTokenCookie();
            if (reqToken) {
                let sessionInfo = await createTmdbSession(reqToken);
                console.log(sessionInfo);
                return sessionInfo.session_id;
            } else {
                return null;
            }
        }

        //set cookies with user session info
        async function setTheCookies() {
            let sessionId = await getSessionId();
            console.log(sessionId);
            let userInfo: any = await getUserInfo(sessionId);
            console.log(userInfo);
            await setSessionCookies(sessionId, userInfo);
        }

        setTheCookies().then(() => router.replace('/'));
    }, [router]);

    return (
        <>
            <p className="text-center my-8">you are now signed in!</p>
            <p className="text-center">taking you home...</p>
        </>
    );
}
