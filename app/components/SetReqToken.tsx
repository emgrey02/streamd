'use client';

import { useEffect } from 'react';
import { setReqTokenCookie } from '../actions';
import { redirect } from 'next/navigation';

export default function SetReqToken(props: { rt: string }) {
    useEffect(() => {
        async function setToken() {
            setReqTokenCookie(props.rt).then(() =>
                redirect(
                    `https://www.themoviedb.org/auth/access?request_token=${props.rt}`
                )
            );
        }
        setToken();
    });

    return <p>Setting request token...</p>;
}
