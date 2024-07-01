'use client';

import { deleteCookie, getAccessToken, tmdbLogOut } from '../actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default async function LogOut() {
    // const userSession: UserSession | null = await kv.get('userSession');
    // const accessToken: string | undefined = userSession?.access_token;
    const router = useRouter();

    useEffect(() => {
        async function removeCookie() {
            const accessToken: string | undefined = await getAccessToken();
            console.log(accessToken);

            const didItWork = await tmdbLogOut(accessToken);
            console.log(didItWork);
            let res = await deleteCookie('accToken');
            console.log(res);
        }

        removeCookie().then(() => router.push('/'));
    }, []);
}
