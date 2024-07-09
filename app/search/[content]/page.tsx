import SearchResults from '../../components/SearchResults';

export default async function Search({
    params,
    searchParams,
}: {
    params: { content: string };
    searchParams: { query: string; page: string };
}) {
    const search = searchParams.query;
    const content = params.content;
    const page = searchParams.page;
    console.log(page);
    let data;

    console.log(content);
    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        cache: 'no-store',
    };

    let movieRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${page}`,
        options
    );

    let tvRes = await fetch(
        `https://api.themoviedb.org/3/search/tv?query=${search}&include_adult=false&language=en-US&page=${page}`,
        options
    );

    let peopleRes = await fetch(
        `https://api.themoviedb.org/3/search/person?query=${search}&include_adult=false&language=en-US&page=${page}`,
        options
    );

    let allRes = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${search}&include_adult=false&language=en-US&page=${page}`,
        options
    );

    const people = await peopleRes.json();
    const peopleLength = people.total_results;

    const movies = await movieRes.json();
    const movieLength = movies.total_results;

    const tv = await tvRes.json();
    const tvLength = tv.total_results;

    const all = await allRes.json();
    const allLength = all.total_results;

    if (content === 'movie') {
        data = movies;
    } else if (content === 'tv') {
        data = tv;
    } else if (content === 'person') {
        data = people;
    } else {
        data = all;
    }

    const lengths = {
        movie: movieLength,
        tv: tvLength,
        people: peopleLength,
        all: allLength,
    };

    if (!movieRes.ok) {
        console.error('failed to complete movie search');
    }
    if (!tvRes.ok) {
        console.error('failed to complete tv search');
    }
    if (!peopleRes.ok) {
        console.error('failed to complete people search');
    }
    if (!allRes.ok) {
        console.error('failed to compete multi search');
    }

    return (
        <>
            <h1 className="mx-4 mt-8 text-lg">Search results for: {search}</h1>
            <SearchResults
                data={data}
                lengths={lengths}
                query={search}
                cat={params.content}
            />
        </>
    );
}
