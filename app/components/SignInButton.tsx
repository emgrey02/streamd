'use client';

import { useState } from 'react';
import { startTmdbSignIn } from '../actions/auth';

export default function SignInButton() {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleClick() {
        setPending(true);
        setError(null);

        try {
            const url = await startTmdbSignIn();
            // Leaves the app entirely, so a client-side router push won't do.
            window.location.href = url;
        } catch {
            // Most likely TMDB rate limiting the auth endpoint. Surface it here
            // rather than letting it reach the error boundary -- the user can
            // just try again.
            setError('Could not reach TMDB. Please try again in a moment.');
            setPending(false);
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={handleClick}
                disabled={pending}
                className="font-bold tracking-wider bg-slate-900 hover:ring-1 ring-slate-200 py-2 px-4 shadow-inner transition disabled:opacity-60"
            >
                {pending ? 'taking you to TMDB...' : 'continue to TMDB'}
            </button>
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
}
