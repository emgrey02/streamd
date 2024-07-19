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
    console.log(content);

    return (
        <div id="seasons">
            <h2>Seasons</h2>
            <LargeCreditsList
                data={content.seasons}
                type="tv"
                credits={false}
                search={false}
                fwr={false}
                seasons={true}
                showId={showId.toString()}
            />
        </div>
    );
}
