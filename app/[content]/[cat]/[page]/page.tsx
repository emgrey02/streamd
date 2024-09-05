import BackButton from '@/app/components/BackButton';
import LargeCreditsList from '@/app/components/LargeCreditsList';
import ListNav from '@/app/components/ListNav';
import Pagination from '@/app/components/Pagination';
import SearchBar from '@/app/components/SearchBar';
import { cookies } from 'next/headers';

export default async function Page({
    params,
}: {
    params: { content: string; cat: string; page: string };
}) {
    const sessionId: string | undefined = cookies().get('sessionId')?.value;
    const accountId: string | undefined = cookies().get('accId')?.value;

    let url;
    let type = 'multi';
    let fwr = false;

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

    return (
        <>
            <div className="@container">
                <LargeCreditsList
                    data={content.results}
                    type={type}
                    search={false}
                    credits={false}
                    fwr={fwr}
                    seasons={false}
                />
            </div>
        </>
    );
}
