'use client';
import Link from 'next/link';

import { useEffect } from 'react';
import { setReqToken } from '../actions';

export default function TmdbSignIn(props: { rt: string }) {
    useEffect(() => {
        async function setToken() {
            let res = await setReqToken(props.rt);
            console.log(res);
        }
        setToken();
    });

    return (
        <Link
            href={`https://www.themoviedb.org/auth/access?request_token=${props.rt}`}
        >
            Sign In
        </Link>
    );
}
