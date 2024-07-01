import Link from 'next/link';

export default async function TmdbSignOut() {
    return <Link href={`${process.env.BASE_URL}/logout`}>Sign Out</Link>;
}
