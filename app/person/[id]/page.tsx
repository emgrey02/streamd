import SmallCreditsList from '@/app/components/Lists/SmallCreditsList';
import { fetchTmdb } from '@/app/lib/tmdb';

export async function generateStaticParams() {
    return [];
}

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

    const content = await fetchTmdb(
        `https://api.themoviedb.org/3/person/${id}?append_to_response=combined_credits&language=en-US&sort_by=primary_release_date.asc`,
        options,
        'fetch person data'
    );

    return (
        <>
            <div>
                <h2 className="font-medium text-lg mb-2">Known For</h2>
                <SmallCreditsList
                    creds={content.combined_credits.cast}
                    contentType="multi"
                    personId={id}
                />
            </div>
        </>
    );
}
