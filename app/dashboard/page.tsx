'use server';
import DashContent from '../components/DashContent';
import BackButton from '../components/BackButton';
import { cookies } from 'next/headers';
import TmdbSignIn from '../components/TmdbSignIn';
import Link from 'next/link';

export default async function Page() {
    const sessionId: string | undefined = cookies().get('sessionId')?.value;
    const accountId: string | undefined = cookies().get('accId')?.value;
    const username: string | undefined = cookies().get('username')?.value;

    return (
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <BackButton main={false} />
            <div>
                <h1 className="text-5xl tracking-wider font-light mb-2">
                    Your Dashboard
                </h1>
                <div className="w-[80%] max-w-full h-[1px] bg-brand-blue"></div>
            </div>
            {!username && (
                <p className="mb-8 italic text-brand-blue">
                    You aren&apos;t logged in!
                </p>
            )}
            {sessionId ?
                <DashContent sessionId={sessionId} accountId={accountId} />
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
