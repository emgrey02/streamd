import LargeCreditsList from '@/app/components/LargeCreditsList';
import Link from 'next/link';

export default async function PersonCredits({
    params,
}: {
    params: { id: string };
}) {
    const personId = params.id;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/person/${personId}?append_to_response=combined_credits&language=en-US&sort_by=primary_release_date.asc`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie data');
    }

    const content = await res.json();

    return (
        <>
            <div id="cast" className="flex flex-col mb-8">
                <h1 className="text-xl font-bold">Cast Credits</h1>
                <Link
                    href="#crew"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Skip to Crew Credits
                </Link>
            </div>
            <LargeCreditsList
                data={content.combined_credits.cast}
                type="multi"
                search={false}
                credits={true}
                fwr={false}
                seasons={false}
            />
            <div id="crew" className="flex flex-col mb-8">
                <h2 className="text-xl font-bold">Crew Credits</h2>
                <Link
                    href="#cast"
                    className="text-sm hover:underline underline-offset-2"
                >
                    Back to Cast Credits
                </Link>
            </div>
            <LargeCreditsList
                data={content.combined_credits.crew}
                type="multi"
                search={false}
                credits={true}
                fwr={false}
                seasons={false}
            />
        </>
    );
}
