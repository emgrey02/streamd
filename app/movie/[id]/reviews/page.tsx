import Reviews from '@/app/components/Reviews';
import { Suspense } from 'react';

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

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch movie reviews');
    }

    const r = await res.json();

    return (
        <div id="reviews" className="my-8 flex flex-col gap-4">
            <Suspense fallback={<p>Loading...</p>}>
                <Reviews reviews={r} />
            </Suspense>
        </div>
    );
}
