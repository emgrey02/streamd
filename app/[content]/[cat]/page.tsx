import BackButton from '@/app/components/BackButton';
import ContentPage from '@/app/components/FullContentListPage/ContentPage';
import ListNav from '@/app/components/FullContentListPage/ListNav';
import SearchBar from '@/app/components/Search/SearchBar';
import { capitalizeCategory, changeToSearchTerm } from '@/app/utils';
import { Suspense } from 'react';

// type is either movies, shows, or trending
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
            // daily
            revalidate: 86400,
        },
    };

    const url = `https://api.themoviedb.org/3/${changeToSearchTerm(content)}/${cat == 'people' ? 'person' : cat}${changeToSearchTerm(content) === 'trending' ? '/day' : ''}?language=en-US&page=1`;

    const res = await fetch(url, options);

    if (!res.ok) {
        console.error('failed to fetch movie/show category');
    }

    const contentData = await res.json();

    return (
        <main className="flex flex-col gap-10 px-2 sm:px-4 pb-10">
            <BackButton main={true} />
            <SearchBar />
            <div>
                <h1 className="text-5xl tracking-wider font-light mb-2">
                    {capitalizeCategory(content)}
                </h1>
                <div className="w-[80%] max-w-full h-px bg-brand-blue"></div>
            </div>
            <ListNav />
            <Suspense fallback={<p>Loading content...</p>}>
                <ContentPage
                    data={contentData.results}
                    type={changeToSearchTerm(content)}
                    cat={cat}
                />
            </Suspense>
        </main>
    );
}
