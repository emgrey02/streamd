'use client';

import { deleteCookies, getAccessToken, tmdbLogOut } from '../actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogOut() {
    const router = useRouter();

    useEffect(() => {
        async function removeCookies() {
            const accessToken: string | undefined = await getAccessToken();
            if (accessToken) {
                const didItWork = await tmdbLogOut(accessToken);
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
