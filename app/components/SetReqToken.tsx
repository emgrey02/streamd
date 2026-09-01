'use client';

import { useEffect } from 'react';
import { setReqTokenCookie } from '../actions/auth';

export default function SetReqToken(props: { rt: string }) {
    useEffect(() => {
        // next/navigation's redirect() can't send the browser to an external
        // origin from a client callback -- this leaves the app entirely.
        setReqTokenCookie(props.rt).then(() => {
            window.location.href = `https://www.themoviedb.org/auth/access?request_token=${props.rt}`;
        });
    }, [props.rt]);

    return <p>Setting request token...</p>;
}
