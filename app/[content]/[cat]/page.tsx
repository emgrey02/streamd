import BackButton from '@/app/components/BackButton';
import ContentPage from '@/app/components/ContentPage';
import ListNav from '@/app/components/ListNav';
import SearchBar from '@/app/components/SearchBar';
import { Suspense } from 'react';

interface Props {
    params: { content: string; cat: string };
}

export default async function Page({ params }: Props) {
    let pageNum = 1;

    if (params.content === 'movies') params.content = 'movie';

    if (params.content === 'shows') params.content = 'tv';

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
    };

    const type = params.content;
    const url = `https://api.themoviedb.org/3/${type}/${params.cat === 'people' ? 'person' : params.cat}${params.content === 'trending' ? '/day' : ''}?language=en-US&page=1`;

    let res = await fetch(url, options);

    if (!res.ok) {
        console.error('failed to fetch movie/show category');
    }
    const content = await res.json();
    console.log(content);

    function renameContent(cont: string) {
        if (cont === 'movie') {
            return 'Movies';
        } else if (cont === 'tv') {
            return 'Shows';
        } else if (cont === 'trending') {
            return 'Trending';
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
            <Suspense fallback={<p>Loading content...</p>}>
                <ContentPage
                    data={content.results}
                    pageNum={pageNum}
                    type={type}
                    cat={params.cat}
                    content={params.content}
                />
            </Suspense>
        </main>
    );
}
