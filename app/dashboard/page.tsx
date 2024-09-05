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
        <main className="px-4 mb-8">
            <BackButton main={false} />
            <h1 className="text-5xl tracking-wider font-light mt-8 mb-2">
                Dashboard
            </h1>
            <div className="w-[80%] max-w-full h-[1px] bg-brand-blue mb-4"></div>
            {username ?
                <p className="mb-8">Hello, {username}!</p>
            :   <p className="mb-8 italic text-brand-blue">
                    You aren&apos;t logged in!
                </p>
            }
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
                    <p>Sign in to see your dashboard.</p>
                    <TmdbSignIn />
                    <Link
                        className="underline underline-offset-2 hover:underline-offset-8 transition-all"
                        href="/"
                    >
                        go home
                    </Link>
                </div>
            }
        </main>
    );
}
