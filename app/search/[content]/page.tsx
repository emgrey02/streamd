import BackButton from '@/app/components/BackButton';
import SearchResults from '../../components/SearchResults';
import { doASearch, genreSearch, keywordSearch } from '@/app/actions';
import SearchResNav from '@/app/components/SearchResNav';
import SearchBar from '@/app/components/SearchBar';
import { Suspense } from 'react';

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

    let movies;
    let shows;
    let people;
    let all;
    console.log(search);

    if (genre) {
        movies = await genreSearch(search.split('--')[0], 'movie', page);
        shows = await genreSearch(search.split('--')[0], 'tv', page);
    } else if (keyword) {
        movies = await keywordSearch(search.split('--')[0], 'movie', page);
        shows = await keywordSearch(search.split('--')[0], 'tv', page);
    } else {
        movies = await doASearch(search, 'movie', +page);
        shows = await doASearch(search, 'tv', +page);
        people = await doASearch(search, 'person', +page);
        all = await doASearch(search, 'multi', +page);
    }

    let peopleLength;
    let allLength;

    if (people && all) {
        peopleLength = people.total_results;
        allLength = all.total_results;
    }

    const movieLength = movies.total_results;
    const tvLength = shows.total_results;
    let data;

    if (content === 'movie') {
        data = movies;
    } else if (content === 'tv') {
        data = shows;
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
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <BackButton main={false} />
            <div>
                <h1 className="text-2xl sm:text-5xl flex tracking-wider items-end font-light mb-2 gap-2">
                    {keyword && (
                        <>
                            <div className="font-light">Keyword:</div>{' '}
                            <div className="text-xl sm:text-4xl italic">
                                {theKeyword}
                            </div>
                        </>
                    )}
                    {genre && (
                        <>
                            <div className="font-light">Genre:</div>
                            <div className="text-xl sm:text-4xl italic">
                                {theGenre}
                            </div>
                        </>
                    )}
                    {!keyword && !genre && `Search results for: ${search}`}
                </h1>
                <div className="w-[80%] max-w-full h-[1px] bg-brand-blue"></div>
            </div>
            <SearchBar
                searchTerm={keyword || genre ? '' : search.split('-')[0]}
            />
            <div className="flex sm:flex-row gap-4 flex-col">
                <SearchResNav
                    keyword={theKeyword || undefined}
                    genre={theGenre || undefined}
                    query={search}
                    lengths={lengths}
                />
                <Suspense fallback={<p>Loading content...</p>}>
                    <SearchResults
                        keyword={theKeyword || undefined}
                        genre={theGenre || undefined}
                        query={search}
                        cat={content}
                        data={data.results}
                    />
                </Suspense>
            </div>
        </main>
    );
}
