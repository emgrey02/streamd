import Reviews from '@/app/components/Reviews';

export default async function ReviewsArea({
    params,
}: {
    params: { id: string };
}) {
    const showId = params.id;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/reviews?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show reviews');
    }

    let r = await res.json();

    return (
        <div id="reviews" className="flex flex-col gap-4">
            <Reviews reviews={r} />
        </div>
    );
}
