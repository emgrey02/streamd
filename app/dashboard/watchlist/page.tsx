import LargeCreditsList from '@/app/components/Lists/LargeCreditsList';
import { cookies } from 'next/headers';
import { fetchAllTmdbPages } from '@/app/lib/tmdb';
import { getSessionId } from '@/app/actions/auth';

export default async function Page() {
    const cookieStore = await cookies();
    const sessionId = await getSessionId();
    const accountId: string | undefined = cookieStore.get('accId')?.value;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const [watchlistedMovies, watchlistedTv] = await Promise.all([
        fetchAllTmdbPages<ContentItem>(
            (page) =>
                `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies?session_id=${sessionId}&language=en-US&page=${page}&sort_by=created_at.asc`,
            options,
            'fetch watchlisted movies'
        ),
        fetchAllTmdbPages<ContentItem>(
            (page) =>
                `https://api.themoviedb.org/3/account/${accountId}/watchlist/tv?session_id=${sessionId}&language=en-US&page=${page}&sort_by=created_at.asc`,
            options,
            'fetch watchlisted tv shows'
        ),
    ]);

    return (
        <>
            <div>
                <h3 className="text-2xl font-medium mb-4">
                    Watchlisted Movies
                </h3>
                <div className="@container">
                    <LargeCreditsList
                        data={watchlistedMovies}
                        type="movie"
                        search={false}
                        credits={false}
                        seasons={false}
                        clip={true}
                        showId={''}
                    />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-medium mb-4">Watchlisted Shows</h3>
                <div className="@container">
                    <LargeCreditsList
                        data={watchlistedTv}
                        type="tv"
                        search={false}
                        credits={false}
                        seasons={false}
                        clip={true}
                        showId={''}
                    />
                </div>
            </div>
        </>
    );
}
