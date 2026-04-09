import LargeCreditsList from '@/app/components/Lists/LargeCreditsList';

export default async function PersonCredits({
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
        `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch person data');
    }

    const content = await res.json();

    return (
        <div className="grid md:grid-cols-2 gap-10">
            <div>
                <div id="cast" className="flex flex-col mb-2">
                    <h1 className="text-lg font-medium">Cast Credits</h1>
                </div>
                {content.cast.length > 0 ?
                    <div className="@container">
                        <LargeCreditsList
                            data={content.cast}
                            type="multi"
                            search={false}
                            credits={true}
                            seasons={false}
                            clip={true}
                        />
                    </div>
                :   <p>No credits available</p>}
            </div>
            <div>
                <div id="crew" className="flex flex-col mb-2">
                    <h2 className="text-lg font-medium">Crew Credits</h2>
                </div>
                {content.crew ?
                    <div className="@container">
                        <LargeCreditsList
                            data={content.crew}
                            type="multi"
                            search={false}
                            credits={true}
                            seasons={false}
                            clip={true}
                        />
                    </div>
                :   <p className="text-slate-400 italic">
                        No credits available
                    </p>
                }
            </div>
        </div>
    );
}
