'use server';
import SetReqToken from '../components/SetReqToken';

export default async function SignInPage() {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'no-store',
        body: JSON.stringify({
            redirect_to: `${process.env.NEXT_PUBLIC_BASE_URL}/approval`,
        }),
    };

    //fetch to get a request token from TMDB
    const res = await fetch(
        'https://api.themoviedb.org/4/auth/request_token',
        options
    );

    //error handling
    if (!res.ok) {
        console.error('failed to fetch v4 request token from tmdb');
    }

    //assign request Token
    const resJson = await res.json();

    const reqToken: string = resJson.request_token;

    return <SetReqToken rt={reqToken} />;
}
