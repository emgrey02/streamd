import Reviews from '@/app/components/ContentPage/Reviews';
import { fetchTmdb } from '@/app/lib/tmdb';

export default async function ReviewsArea({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const r = await fetchTmdb(
        `https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US`,
        options,
        'fetch show reviews'
    );

    return (
        <div id="reviews" className="flex flex-col gap-4">
            <Reviews reviews={r} />
        </div>
    );
}
