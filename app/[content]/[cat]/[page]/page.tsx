import BackButton from '@/app/components/BackButton';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import Pagination from '@/app/components/Pagination';
import { cookies } from 'next/headers';

export default async function Page({
    params,
}: {
    params: { content: string; cat: string; page: string };
}) {
    console.log(params.content, params.cat);
    const sessionId: string | undefined = cookies().get('sessionId')?.value;
    const accountId: string | undefined = cookies().get('accId')?.value;

    let url;
    let type = 'multi';
    let fwr = false;

    console.log(params.content, params.cat);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    if (
        params.content === 'favorite' ||
        params.content === 'watchlist' ||
        params.content === 'rated'
    ) {
        type = params.cat === 'movie' ? 'movies' : params.cat;
        url = `https://api.themoviedb.org/3/account/${accountId}/${params.content}/${type}?language=en-US&page=${params.page}&session_id=${sessionId}`;
        fwr = true;
    } else {
        type = params.content;
        url = `https://api.themoviedb.org/3/${type}/${params.cat === 'people' ? 'person' : params.cat}${params.content === 'trending' ? '/day' : ''}?language=en-US&page=${params.page}`;
    }

    let res = await fetch(url, options);

    if (!res.ok) {
        console.error('failed to fetch movie/show category');
    }

    const content = await res.json();
    const totalPages = content.total_pages;
    console.log(totalPages);

    console.log(content);
    console.log(type);

    function capitalizeCategory(cat: string) {
        if (cat.includes('_')) {
            let array = cat.split('_');
            let firstLetterCap = array[0].slice(0, 1).toUpperCase();
            let secondLetterCap = array[1].slice(0, 1).toUpperCase();

            array[0] = firstLetterCap + array[0].slice(1);
            array[1] = secondLetterCap + array[1].slice(1);

            if (array[2]) {
                let thirdLetterCap = array[2]?.slice(0, 1).toUpperCase();
                array[2] = thirdLetterCap + array[2]?.slice(1);
            }

            return `${array.join(' ')}`;
        } else {
            let capLetter = cat.slice(0, 1).toUpperCase();
            if (cat === 'movie') cat = 'movies';
            return `${capLetter}${cat.slice(1)}`;
        }
    }

    function renameContent(cont: string) {
        if (cont === 'movie') {
            return 'Movies';
        } else if (cont === 'tv') {
            return 'Shows';
        } else if (cont === 'trending') {
            return 'Trending';
        } else if (cont === 'favorite') {
            return 'Favorite';
        } else if (cont === 'watchlist') {
            return 'Watchlist';
        } else if (cont === 'rated') {
            return 'Rated';
        }
    }

    console.log(params.content);
    console.log(params.cat);

    // trending:
    // all trending --> Trending
    // movie trending --> Trending Movies
    // tv trending --> Trending Tv
    // people trending --> Trending People

    //movies:
    // now_playing movie --> Now Playing Movies
    // popular movie --> Popular Movies
    // top rated movie --> Top Rated Movies
    // upcoming movie --> Upcoming Movies

    //tv:
    // airing_today tv --> Shows Airing Today
    // on_the_air tv --> Shows On The Air
    // popular tv --> Popular Shows
    // top_rated tv --> Top Rated Shows

    return (
        <main className="mx-4 my-8">
            <h1 className="text-xl">
                {(
                    params.content === 'trending' ||
                    params.cat === 'airing_today' ||
                    params.cat === 'on_the_air' ||
                    params.content === 'favorite'
                ) ?
                    `${renameContent(params.content)} ${capitalizeCategory(params.cat)}`
                :   `${capitalizeCategory(params.cat)} ${renameContent(params.content)}`
                }
            </h1>
            <BackButton />
            <Pagination
                page={+params.page}
                totalPages={totalPages}
                cat={params.cat}
                content={params.content}
                search={false}
            />
            <LargeCreditsList
                data={content.results}
                type={type}
                search={false}
                credits={false}
                fwr={fwr}
                seasons={false}
            />
            <Pagination
                page={+params.page}
                totalPages={totalPages}
                cat={params.cat}
                content={params.content}
                search={false}
            />
        </main>
    );
}
