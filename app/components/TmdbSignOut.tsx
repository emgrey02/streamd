import Link from 'next/link';

export default async function TmdbSignOut() {
    return <Link href={`/logout`}>Sign Out</Link>;
}
