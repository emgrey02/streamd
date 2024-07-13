import BackButton from '@/app/components/BackButton';
import Reviews from '@/app/components/Reviews';

export default async function ReviewsPage({
    params,
}: {
    params: { id: string };
}) {
    const movieId = params.id;
    console.log(movieId);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let reviewsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`,
        options
    );

    if (!reviewsRes.ok) {
        console.error('failed to fetch movie reviews');
    }

    let reviews = await reviewsRes.json();

    return (
        <>
            <Reviews reviews={reviews} />
            <BackButton />
        </>
    );
}
