import LargeCreditsList from '@/app/components/Lists/LargeCreditsList';
import { cookies } from 'next/headers';
import { fetchAllTmdbPages } from '@/app/lib/tmdb';

export default async function Page() {
    const cookieStore = await cookies();
    const sessionId: string | undefined = cookieStore.get('sessionId')?.value;
    const accountId: string | undefined = cookieStore.get('accId')?.value;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const [ratedMovies, ratedTv] = await Promise.all([
        fetchAllTmdbPages<ContentItem>(
            (page) =>
                `https://api.themoviedb.org/3/account/${accountId}/rated/movies?session_id=${sessionId}&language=en-US&page=${page}&sort_by=created_at.asc`,
            options,
            'fetch rated movies'
        ),
        fetchAllTmdbPages<ContentItem>(
            (page) =>
                `https://api.themoviedb.org/3/account/${accountId}/rated/tv?session_id=${sessionId}&language=en-US&page=${page}&sort_by=created_at.asc`,
            options,
            'fetch rated tv shows'
        ),
    ]);

    return (
        <>
            <div>
                <h3 className="text-2xl font-medium mb-4">Rated Movies</h3>
                <div className="@container">
                    <LargeCreditsList
                        data={ratedMovies}
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
                <h3 className="text-2xl font-medium mb-4">Rated Shows</h3>
                <div className="@container">
                    <LargeCreditsList
                        data={ratedTv}
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
