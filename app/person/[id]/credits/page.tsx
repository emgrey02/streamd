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
        console.error('failed to fetch person data');
    }

    const content = await res.json();
    console;

    return (
        <div className="grid md:grid-cols-2 gap-10">
            <div>
                <div id="cast" className="flex flex-col mb-2">
                    <h1 className="text-lg font-medium">Cast Credits</h1>
                </div>
                <div className="@container">
                    <LargeCreditsList
                        data={content.combined_credits.cast}
                        type="multi"
                        search={false}
                        credits={true}
                        fwr={false}
                        seasons={false}
                    />
                </div>
            </div>
            <div>
                <div id="crew" className="flex flex-col mb-2">
                    <h2 className="text-lg font-medium">Crew Credits</h2>
                </div>
                <div className="@container">
                    <LargeCreditsList
                        data={content.combined_credits.crew}
                        type="multi"
                        search={false}
                        credits={true}
                        fwr={false}
                        seasons={false}
                    />
                </div>
            </div>
        </div>
    );
}
