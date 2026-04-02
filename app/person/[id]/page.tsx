import SmallCreditsList from '@/app/components/SmallCreditsList';

export default async function PersonPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'force-cache',
    };

    const res = await fetch(
        `https://api.themoviedb.org/3/person/${id}?append_to_response=combined_credits&language=en-US&sort_by=primary_release_date.asc`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch person data');
    }

    const content = await res.json();

    return (
        <>
            <div>
                <h2 className="font-medium text-lg mb-2">Known For</h2>
                <SmallCreditsList
                    creds={content.combined_credits.cast}
                    showId={id}
                    personId={id}
                />
            </div>
        </>
    );
}
