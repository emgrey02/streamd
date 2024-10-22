import BackButton from '@/app/components/BackButton';
import ListNav from '@/app/components/ListNav';
import Pagination from '@/app/components/Pagination';
import SearchBar from '@/app/components/SearchBar';
import { cookies } from 'next/headers';

interface LayoutProps {
    children: React.ReactNode;
    params: { content: string; cat: string; page: string };
}

export default async function Layout({ children, params }: LayoutProps) {
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
    const totalPages = content.total_pages;

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

    return (
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <BackButton main={false} />
            <SearchBar />
            <div>
                <h1 className="text-5xl tracking-wider font-light mb-2">
                    {renameContent(params.content)}
                </h1>
                <div className="w-[80%] max-w-full h-[1px] bg-brand-blue"></div>
            </div>
            <ListNav />
            <Pagination
                page={+params.page}
                totalPages={totalPages}
                cat={params.cat}
                content={params.content}
                search={false}
                keyword={false}
                genre={false}
            />
            {children}
            <Pagination
                page={+params.page}
                totalPages={totalPages}
                cat={params.cat}
                content={params.content}
                search={false}
                keyword={false}
                genre={false}
            />
        </main>
    );
}
