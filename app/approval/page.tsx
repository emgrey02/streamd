import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

//user is sent to this page after authenticating with tmdb
export default async function Page() {
    const user = await currentUser();

    //get request token
    const reqToken = user?.publicMetadata.reqToken;
    console.log('request token:', reqToken);

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

    //put session_id in user's private metadata for safe keeping
    await fetch('http://localhost:3000/private', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: user?.id,
            accessToken: sessionResJson.access_token,
        }),
    });

    //put account_id is user's public metadata
    await fetch('http://localhost:3000/public', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: user?.id,
            accountId: sessionResJson.account_id,
        }),
    });

    console.log('private metadata:', user?.privateMetadata);
    console.log('public metadata:', user?.publicMetadata);
    redirect('http://localhost:3000/dashboard');

    return <h1>You&apos;ve been approved {user?.firstName}!</h1>;
}
