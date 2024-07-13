export default async function Info(params: { id: string }) {
    const movieId = params.id;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        options
    );

    let deets = await res.json();
    console.log(deets);

    return <div>hi here&apos;s some info</div>;
}
