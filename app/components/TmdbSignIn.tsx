import Link from 'next/link';

export default function TmdbSignIn(props: { rt: string }) {
    return (
        <Link
            href={`https://www.themoviedb.org/auth/access?request_token=${props.rt}`}
        >
            Sign In
        </Link>
    );
}
