import TmdbSignIn from '../TmdbSignIn';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function DashContent(props: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const sessionId: string | undefined = cookieStore.get('sessionId')?.value;
    const username: string | undefined = cookieStore.get('username')?.value;
    return (
        <>
            {!username && (
                <p className="mb-8 italic text-brand-blue">
                    You aren&apos;t logged in!
                </p>
            )}
            {sessionId ? (
                <>{props.children}</>
            ) : (
                <div className="text-center flex flex-col items-center justify-center gap-4 h-96">
                    <p>Sign in to see your dashboard.</p>
                    <TmdbSignIn />
                    <Link
                        className="underline underline-offset-2 hover:underline-offset-8 transition-all"
                        href="/"
                    >
                        go home
                    </Link>
                </div>
            )}
        </>
    );
}
