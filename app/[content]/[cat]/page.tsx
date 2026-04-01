import BackButton from '@/app/components/BackButton';
import ContentPage from '@/app/components/ContentPage';
import ListNav from '@/app/components/ListNav';
import SearchBar from '@/app/components/SearchBar';
import { Suspense } from 'react';

// content is either movies, shows, or trending
export default async function Page({
    params,
}: {
    params: Promise<{ content: string; cat: string }>;
}) {
    const { content, cat } = await params;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
        next: {
            revalidate: 86400,
        },
    };

    const url = `https://api.themoviedb.org/3/${content}/${cat}${content === 'trending' ? '/day' : ''}?language=en-US&page=1`;

    const res = await fetch(url, options);

    if (!res.ok) {
        console.error('failed to fetch movie/show category');
    }
    const contentData = await res.json();

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
                    {renameContent(content)}
                </h1>
                <div className="w-[80%] max-w-full h-px bg-brand-blue"></div>
            </div>
            <ListNav />
            <Suspense fallback={<p>Loading content...</p>}>
                <ContentPage
                    data={contentData.results}
                    pageNum={1}
                    type={content}
                    cat={cat}
                    content={content}
                />
            </Suspense>
        </main>
    );
}
