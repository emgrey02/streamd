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
    const router = useRouter();

    useEffect(() => {
        //get request token stored in cookie
        async function getTokenCookie() {
            const reqToken = await getReqTokenCookie();
            //console.log(reqToken);
            return reqToken;
        }

        //get access Token & other session info w/ this request token & return it
        async function getSessionAccessInfo() {
            const reqToken = await getTokenCookie();
            if (reqToken) {
                const sessionAccessInfo = await createTmdbSession(reqToken);
                //console.log(sessionAccessInfo);
                return sessionAccessInfo;
            } else {
                return null;
            }
        }

        //set cookies with user session info
        async function setTheCookies() {
            const sessionAccessInfo = await getSessionAccessInfo();
            console.log(sessionAccessInfo);
            if (sessionAccessInfo) {
                const userInfo = await getUserInfo(
                    sessionAccessInfo.session.session_id
                );
                //console.log(userInfo);
                const accessToken = sessionAccessInfo.access.access_token;
                const sessionId = sessionAccessInfo.session.session_id;
                const accountId = sessionAccessInfo.access.account_id;

                await setSessionCookies(
                    sessionId,
                    userInfo,
                    accessToken,
                    accountId
                );
            }
        }

        setTheCookies().then(() => router.replace('/'));
    }, [router]);

    return (
        <div className="text-center my-8">
            <p>you are now signed in!</p>
            <p>taking you home...</p>
        </div>
    );
}
