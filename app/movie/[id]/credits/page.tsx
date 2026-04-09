import LargeCreditsList from '@/app/components/Lists/LargeCreditsList';
import { Suspense } from 'react';

export default async function MovieCredits({
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
        `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie credits');
    }

    const deets = await res.json();

    return (
        <div id="credits" className="grid grid-cols-2 gap-10">
            <div>
                <h2 className="text-xl mb-4 font-medium">Cast</h2>
                <div className="@container">
                    <Suspense fallback={<p>Loading...</p>}>
                        <LargeCreditsList
                            data={deets.cast}
                            type="tv"
                            search={false}
                            credits={true}
                            seasons={false}
                            clip={true}
                        />
                    </Suspense>
                </div>
            </div>
            <div>
                <h2 className="text-xl mb-4 font-medium">Crew</h2>
                <div className="@container">
                    <Suspense fallback={<p>Loading...</p>}>
                        <LargeCreditsList
                            data={deets.crew}
                            type="tv"
                            search={false}
                            credits={true}
                            seasons={false}
                            clip={true}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
