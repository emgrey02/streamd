'use server';

import { redirect } from 'next/navigation';
import { kv } from '@vercel/kv';

//user is sent to this page after authenticating with tmdb
export default async function Page() {
    //get request token
    const reqToken = await kv.get('reqToken');
    console.log('reqtoken', reqToken);

    //create new options object for fetching session_id using request token
    const sessionOptions = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
            request_token: reqToken,
        }),
    };

    //get session_id & return it
    const sessionRes = await fetch(
        'https://api.themoviedb.org/4/auth/access_token',
        sessionOptions
    );

    if (!sessionRes.ok) {
        console.error('failed to get access token');
    }

    const sessionResJson = await sessionRes.json();
    console.log(sessionResJson);

    await kv.set('userSession', sessionResJson);
    let session = await kv.get('userSession');
    console.log(session);

    redirect('http://localhost:3000/dashboard');
}
