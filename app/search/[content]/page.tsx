import SearchResults from '../../components/SearchResults';

export default async function Search({
    params,
    searchParams,
}: {
    params: { content: string };
    searchParams: { query: string; page: string };
}) {
    const search = searchParams.query;
    let content = params.content;
    let keyword = false;
    let genre = false;
    const page = searchParams.page;
    let theKeyword;
    let theGenre;
    console.log(content);
    console.log(searchParams.query);

    if (content.includes('keyword')) {
        content = content.split('-')[1];
        keyword = true;
        theKeyword = search.split('--')[1];
        console.log(search);
    } else if (content.includes('genre')) {
        content = content.split('-')[1];
        genre = true;
        theGenre = search.split('--')[1];
        console.log(search.split('--')[0]);
        console.log(search);
    }

    let data;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    let movieRes;
    let tvRes;
    let peopleRes;
    let allRes;
    console.log(search);

    if (genre) {
        movieRes = await fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${search.split('--')[0]}'`,
            options
        );

        tvRes = await fetch(
            `https://api.themoviedb.org/3/discover/tv?with_genres=${search.split('--')[0]}&include_adult=false&sort_by=popularity.desc&language=en-US&page=${page}`,
            options
        );
    } else if (keyword) {
        movieRes = await fetch(
            `https://api.themoviedb.org/3/discover/movie?with_keywords=${search.split('--')[0]}&include_adult=false&sort_by=popularity.desc&language=en-US&page=${page}`,
            options
        );
        tvRes = await fetch(
            `https://api.themoviedb.org/3/discover/tv?with_keywords=${search.split('--')[0]}&include_adult=false&sort_by=popularity.desc&language=en-US&page=${page}`,
            options
        );
    } else {
        movieRes = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
            options
        );
        tvRes = await fetch(
            `https://api.themoviedb.org/3/search/tv?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
            options
        );
        peopleRes = await fetch(
            `https://api.themoviedb.org/3/search/person?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
            options
        );

        allRes = await fetch(
            `https://api.themoviedb.org/3/search/multi?query=${search}&include_adult=false&sort_by=popularity.asc&language=en-US&page=${page}`,
            options
        );
    }

    let people;
    let peopleLength;
    let all;
    let allLength;

    if (peopleRes && allRes) {
        people = await peopleRes.json();
        peopleLength = people.total_results;
        all = await allRes.json();
        allLength = all.total_results;

        if (!peopleRes.ok) {
            console.error('failed to complete people search');
        }
        if (!allRes.ok) {
            console.error('failed to compete multi search');
        }
    }

    if (!movieRes.ok) {
        console.error('failed to complete movie search');
    }
    if (!tvRes.ok) {
        console.error('failed to complete tv search');
    }

    const movies = await movieRes.json();
    const movieLength = movies.total_results;

    const tv = await tvRes.json();
    const tvLength = tv.total_results;

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

    return (
        <>
            <h1 className="mx-4 mt-8 text-lg text-center">
                {keyword && (
                    <>
                        <div className="font-light">Keyword</div>{' '}
                        <div className="text-xl font-medium">{theKeyword}</div>
                    </>
                )}
                {genre && (
                    <>
                        <div className="font-light">Genre</div>
                        <div className="text-xl font-medium">{theGenre}</div>
                    </>
                )}
                {!keyword && !genre && `Search results for: ${search}`}
            </h1>
            <div className="w-full">
                <SearchResults
                    data={data}
                    lengths={lengths}
                    query={search}
                    cat={content}
                    keyword={keyword}
                    genre={genre}
                />
            </div>
        </>
    );
}
