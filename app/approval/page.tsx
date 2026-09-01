'use client';

import {
    getReqTokenCookie,
    createTmdbSession,
    setSessionCookies,
    getUserInfo,
} from '../actions/auth';
import { useEffect } from 'react';

//user is sent to this page after authenticating with tmdb
export default function Page() {
    useEffect(() => {
        //get request token stored in cookie
        async function getTokenCookie() {
            return await getReqTokenCookie();
        }

        //get access Token & other session info w/ this request token & return it
        async function getSessionAccessInfo() {
            const reqToken = await getTokenCookie();
            if (reqToken) {
                return await createTmdbSession(reqToken);
            } else {
                return null;
            }
        }

        //set cookies with user session info
        async function setTheCookies() {
            const sessionAccessInfo = await getSessionAccessInfo();
            if (sessionAccessInfo) {
                const userInfo = await getUserInfo(
                    sessionAccessInfo.session.session_id
                );
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

        // A full document load, not router.replace: the sign-in state in the
        // nav lives in the root layout, which persists across a client-side
        // transition and would keep rendering the pre-sign-in cookie snapshot.
        setTheCookies().then(() => window.location.replace('/'));
    }, []);

    return (
        <div className="text-center my-8">
            <p>you are now signed in!</p>
            <p>taking you home...</p>
        </div>
    );
}
