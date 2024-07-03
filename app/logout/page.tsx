'use client';

import { deleteCookies, getSessionId, tmdbLogOut } from '../actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogOut() {
    const router = useRouter();

    useEffect(() => {
        async function removeCookies() {
            const sessionId: string | undefined = await getSessionId();
            if (sessionId) {
                const didItWork = await tmdbLogOut(sessionId);
                console.log(didItWork);
                let res = await deleteCookies();
                console.log(res);
            }
        }

        removeCookies();

        setTimeout(() => {
            router.replace('/');
        }, 2000);
    });

    return (
        <div className="text-center my-8">
            <p>you&apos;ve successfully logged out</p>
            <p>taking you home...</p>
        </div>
    );
}
