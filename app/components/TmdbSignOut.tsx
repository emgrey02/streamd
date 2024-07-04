import Link from 'next/link';

export default async function TmdbSignOut() {
    return (
        <Link
            className="font-bold tracking-wider bg-slate-900 hover:ring-1 ring-slate-200 py-2 px-4 shadow-inner transition"
            href={`/logout`}
        >
            sign out
        </Link>
    );
}
