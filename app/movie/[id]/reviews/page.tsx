import Reviews from '@/app/components/ContentPage/Reviews';
import { Suspense } from 'react';
import { fetchTmdb } from '@/app/lib/tmdb';

export async function generateStaticParams() {
    return [];
}

export default async function ReviewsArea({
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

    const r = await fetchTmdb(
        `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US`,
        options,
        'fetch movie reviews'
    );

    return (
        <div id="reviews" className="my-8 flex flex-col gap-4">
            <Suspense fallback={<p>Loading...</p>}>
                <Reviews reviews={r} />
            </Suspense>
        </div>
    );
}
