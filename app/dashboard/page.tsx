'use server';
import ContentList from '../components/ContentList';
import BackButton from '../components/BackButton';
import { cookies } from 'next/headers';
import TmdbSignIn from '../components/TmdbSignIn';
import Link from 'next/link';

export default async function Page() {
    const sessionId: string | undefined = cookies().get('sessionId')?.value;
    const accountId: string | undefined = cookies().get('accId')?.value;
    const username: string | undefined = cookies().get('username')?.value;

    return (
        <main className="md:px-2">
            <h1 className="text-center text-lg font-bold mt-8">
                Your Dashboard
            </h1>
            {username && <p className="text-center">Hello, {username}</p>}
            <BackButton />
            {sessionId ?
                <ul className="grid gap-8">
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="favorite"
                            cat={['movie', 'tv']}
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="watchlist"
                            cat={['movie', 'tv']}
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="rated"
                            cat={['movie', 'tv']}
                        />
                    </li>
                </ul>
            :   <div className="text-center flex flex-col items-center justify-center gap-4 h-96">
                    <p>Sign in to see your dashboard</p>
                    <TmdbSignIn />
                    <Link
                        className="underline underline-offset-2 hover:underline-offset-8 transition-all"
                        href="/"
                    >
                        go home
                    </Link>
                </div>
            }
            <BackButton />
        </main>
    );
}
