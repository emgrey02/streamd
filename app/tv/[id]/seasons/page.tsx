import LargeCreditsList from '@/app/components/LargeCreditsList';

export default async function SeasonsArea({
    params,
}: {
    params: { id: string };
}) {
    const showId = params.id;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show data');
    }

    let content = await res.json();

    return (
        <div className="@container" id="seasons">
            <h2 className="font-medium text-lg mb-2">Seasons</h2>
            <LargeCreditsList
                data={content.seasons}
                type="tv"
                credits={false}
                search={false}
                seasons={true}
                showId={showId.toString()}
                clip={true}
            />
        </div>
    );
}
