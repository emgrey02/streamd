import LargeCreditsList from '@/app/components/Lists/LargeCreditsList';
import { cookies } from 'next/headers';

export default async function Page() {
    const cookieStore = await cookies();
    const sessionId: string | undefined = cookieStore.get('sessionId')?.value;
    const accountId: string | undefined = cookieStore.get('accId')?.value;
    let moviePageCount: number = 1;
    let tvPageCount: number = 1;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const moviesRes = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies?session_id=${sessionId}&language=en-US&page=${moviePageCount}&sort_by=created_at.asc`,
        options
    );

    const tvRes = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/watchlist/tv?session_id=${sessionId}&language=en-US&page=${tvPageCount}&sort_by=created_at.asc`,
        options
    );

    let watchlistedMovies = await moviesRes.json();
    const movieTotalPages = watchlistedMovies.total_pages;
    watchlistedMovies = watchlistedMovies.results;

    let watchlistedTv = await tvRes.json();
    const tvTotalPages = watchlistedTv.total_pages;
    watchlistedTv = watchlistedTv.results;

    while (movieTotalPages > moviePageCount) {
        moviePageCount++;
        const nextMovieRes = await fetch(
            `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies?session_id=${sessionId}&language=en-US&page=${moviePageCount}&sort_by=created_at.asc`,
            options
        );
        const favMovies = await nextMovieRes.json();
        watchlistedMovies = watchlistedMovies.concat(favMovies.results);
    }

    while (tvTotalPages > tvPageCount) {
        tvPageCount++;
        const nextTvRes = await fetch(
            `https://api.themoviedb.org/3/account/${accountId}/watchlist/tv?session_id=${sessionId}&language=en-US&page=${tvPageCount}&sort_by=created_at.asc`,
            options
        );
        const favTv = await nextTvRes.json();
        watchlistedTv = watchlistedTv.concat(favTv.results);
    }

    if (!moviesRes.ok) {
        console.error(`failed to fetch watchlisted movies`);
    }
    if (!tvRes.ok) {
        console.error('failed to fetch watchlisted tv shows');
    }

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
