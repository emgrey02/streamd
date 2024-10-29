'use client';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { setReqTokenCookie, getRequestToken } from '../actions';

export default function TmdbSignIn() {
    const [reqToken, setReqToken] = useState(null);
    const url = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        async function setToken() {
            const reqToken = await getRequestToken();
            setReqToken(reqToken);
            let res = await setReqTokenCookie(reqToken);
            console.log(`setting reqtoken cookie is a ${res}`);
        }
        setToken();
    }, []);

    return (
        <Link
            className="font-bold tracking-wider bg-slate-900 hover:ring-1 ring-slate-200 py-2 px-4 shadow-inner transition"
            href={`https://www.themoviedb.org/auth/access?request_token=${reqToken}`}
        >
            sign in
        </Link>
    );
}
