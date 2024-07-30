import LargeCreditsList from '@/app/components/LargeCreditsList';

export default async function ShowCredits({
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
        `https://api.themoviedb.org/3/tv/${showId}/aggregate_credits?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show credits');
    }

    let deets = await res.json();

    return (
        <div className="grid md:grid-cols-2 gap-10">
            <div className="@container">
                <h2 className="text-lg mb-2 font-medium">Cast</h2>
                <LargeCreditsList
                    data={deets.cast}
                    type="tv"
                    search={false}
                    credits={true}
                    fwr={false}
                    seasons={false}
                />
            </div>
            <div className="@container">
                <h2 className="text-lg mb-2 font-medium">Crew</h2>
                <LargeCreditsList
                    data={deets.crew}
                    type="tv"
                    search={false}
                    credits={true}
                    fwr={false}
                    seasons={false}
                />
            </div>
        </div>
    );
}
