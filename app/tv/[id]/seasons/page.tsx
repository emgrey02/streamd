import LargeCreditsList from '@/app/components/Lists/LargeCreditsList';
import { fetchTmdb } from '@/app/lib/tmdb';

export async function generateStaticParams() {
    return [];
}

export default async function SeasonsArea({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const content = await fetchTmdb(
        `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
        options,
        'fetch show data'
    );

    return (
        <div className="@container" id="seasons">
            <h2 className="font-medium text-lg mb-2">Seasons</h2>
            <LargeCreditsList
                data={content.seasons}
                type="tv"
                credits={false}
                search={false}
                seasons={true}
                showId={id.toString()}
                clip={true}
            />
        </div>
    );
}
