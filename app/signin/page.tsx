import type { Metadata } from 'next';
import SignInButton from '../components/SignInButton';

export const metadata: Metadata = {
    title: 'Sign in',
};

// Renders no TMDB request of its own, so this page is fully static and safe to
// prefetch. The request token is minted by the button's server action, on click.
export default function SignInPage() {
    return (
        <main className="flex flex-col items-center gap-6 text-center my-12 px-4">
            <h1 className="text-2xl tracking-wider">sign in</h1>
            <p className="max-w-[45ch] font-light">
                streamd uses your TMDB account. You&apos;ll approve access on
                themoviedb.org and come straight back here.
            </p>
            <SignInButton />
        </main>
    );
}
