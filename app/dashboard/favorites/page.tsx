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
        `https://api.themoviedb.org/3/account/${accountId}/favorite/movies?session_id=${sessionId}&language=en-US&page=${moviePageCount}&sort_by=created_at.asc`,
        options
    );

    const tvRes = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/favorite/tv?session_id=${sessionId}&language=en-US&page=${tvPageCount}&sort_by=created_at.asc`,
        options
    );

    let favoriteMovies = await moviesRes.json();
    const movieTotalPages = favoriteMovies.total_pages;
    favoriteMovies = favoriteMovies.results;

    let favoriteTv = await tvRes.json();
    const tvTotalPages = favoriteTv.total_pages;
    favoriteTv = favoriteTv.results;

    while (movieTotalPages > moviePageCount) {
        moviePageCount++;
        const nextMovieRes = await fetch(
            `https://api.themoviedb.org/3/account/${accountId}/favorite/movies?session_id=${sessionId}&language=en-US&page=${moviePageCount}&sort_by=created_at.asc`,
            options
        );
        const favMovies = await nextMovieRes.json();
        favoriteMovies = favoriteMovies.concat(favMovies.results);
    }

    while (tvTotalPages > tvPageCount) {
        tvPageCount++;
        const nextTvRes = await fetch(
            `https://api.themoviedb.org/3/account/${accountId}/favorite/tv?session_id=${sessionId}&language=en-US&page=${tvPageCount}&sort_by=created_at.asc`,
            options
        );
        const favTv = await nextTvRes.json();
        favoriteTv = favoriteTv.concat(favTv.results);
    }

    if (sessionId && !moviesRes.ok) {
        console.error(`failed to fetch favorite movies`);
    }
    if (sessionId && !tvRes.ok) {
        console.error('failed to fetch favorite tv shows');
    }

    return (
        <>
            <div>
                <h3 className="text-2xl font-medium mb-4">Favorite Movies</h3>
                <div className="@container">
                    <LargeCreditsList
                        data={favoriteMovies}
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
                <h3 className="text-2xl font-medium mb-4">Favorite Shows</h3>
                <div className="@container">
                    <LargeCreditsList
                        data={favoriteTv}
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
