import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { reqToken } = body;

    return new Response('successfully set cookie', {
        status: 200,
        headers: { 'Set-Cookie': `reqToken=${reqToken}; HttpOnly; Max-Age=60` },
    });
}

export async function GET() {
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
    } else {
        console.log('successfully got request token from tmdb');
    }
    const resJson = await res.json();

    return Response.json(resJson.request_token);
}
