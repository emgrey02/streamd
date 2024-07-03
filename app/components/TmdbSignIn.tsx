'use client';
import Link from 'next/link';

import { useEffect } from 'react';
import { setReqToken } from '../actions';

export default function TmdbSignIn(props: { rt: string | undefined }) {
    const url = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(props.rt);

    useEffect(() => {
        async function setToken() {
            if (props.rt) {
                let res = await setReqToken(props.rt);
                console.log(`setting reqtoken cookie is a ${res}`);
            }
        }
        setToken();
    }, [props.rt]);

    return (
        <Link
            className="font-bold tracking-wider bg-slate-900 hover:ring-1 ring-slate-200 py-2 px-4 shadow-inner transition"
            href={`https://www.themoviedb.org/authenticate/${props.rt}?redirect_to=${url}/approval`}
        >
            Sign In
        </Link>
    );
}
