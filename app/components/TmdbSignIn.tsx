'use client';
import Link from 'next/link';

import { useEffect } from 'react';
import { setReqToken } from '../actions';

export default function TmdbSignIn(props: { rt: string | undefined }) {
    useEffect(() => {
        async function setToken() {
            if (props.rt) {
                let res = await setReqToken(props.rt);
                console.log(`retrieving request token is a ${res}`);
            }
        }
        setToken();
    }, [props.rt]);

    return (
        <Link
            href={`https://www.themoviedb.org/auth/access?request_token=${props.rt}`}
        >
            Sign In
        </Link>
    );
}
