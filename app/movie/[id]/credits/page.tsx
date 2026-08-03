import LargeCreditsList from '@/app/components/Lists/LargeCreditsList';
import { Suspense } from 'react';
import { fetchTmdb } from '@/app/lib/tmdb';

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

    const deets = await fetchTmdb(
        `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
        options,
        'fetch movie credits'
    );

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
