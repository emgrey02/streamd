import LargeCreditsList from '@/app/components/LargeCreditsList';

export default async function MovieCredits({
    params,
}: {
    params: { id: string };
}) {
    const movieId = params.id;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie credits');
    }

    let deets = await res.json();

    return (
        <div id="credits" className="grid grid-cols-2 gap-10">
            <div>
                <h2 className="text-xl mb-4 font-medium">Cast</h2>
                <div className="@container">
                    <LargeCreditsList
                        data={deets.cast}
                        type="tv"
                        search={false}
                        credits={true}
                        seasons={false}
                        clip={true}
                    />
                </div>
            </div>
            <div>
                <h2 className="text-xl mb-4 font-medium">Crew</h2>
                <div className="@container">
                    <LargeCreditsList
                        data={deets.crew}
                        type="tv"
                        search={false}
                        credits={true}
                        seasons={false}
                        clip={true}
                    />
                </div>
            </div>
        </div>
    );
}
