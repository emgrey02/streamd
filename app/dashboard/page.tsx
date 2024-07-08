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
        <main className="px-4">
            <h1 className="text-center">Your Dashboard</h1>
            <BackButton />
            {username && <p className="my-8">Hello, {username}</p>}
            {sessionId ?
                <ul className="grid gap-8">
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="movies"
                            cat="favorite"
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="tv"
                            cat="favorite"
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="movies"
                            cat="watchlist"
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="tv"
                            cat="watchlist"
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="movies"
                            cat="rated"
                        />
                    </li>
                    <li>
                        <ContentList
                            sessionId={sessionId}
                            accountId={accountId}
                            content="tv"
                            cat="rated"
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
