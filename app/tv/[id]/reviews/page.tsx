import Reviews from '@/app/components/Reviews';

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

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show reviews');
    }

    const r = await res.json();

    return (
        <div id="reviews" className="flex flex-col gap-4">
            <Reviews reviews={r} />
        </div>
    );
}
