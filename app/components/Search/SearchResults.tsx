'use client';

import { useEffect, useState } from 'react';
import { doASearch, genreSearch, keywordSearch } from '../../actions';
import LargeCreditsList from '@/app/components/Lists/LargeCreditsList';

interface SearchResultsProps {
    keyword?: string;
    genre?: string;
    query: string;
    cat: string;
    data: MovieItem[] | ShowItem[] | CastCrewItem[] | ContentItem[];
    lengths: { movie: number; tv: number; people: number; all: number };
}

export default function SearchResults({
    keyword,
    genre,
    query,
    cat,
    data,
    lengths,
}: SearchResultsProps) {
    const [loadMore, setLoadMore] = useState(false);
    const [shownPageNumbers, setShownPageNumbers] = useState(1);
    const [finalData, setFinalData] = useState(data);

    let totalCount;

    switch (cat) {
        case 'person':
            totalCount = lengths.people;
            break;
        case 'tv':
            totalCount = lengths.tv;
            break;
        case 'movie':
            totalCount = lengths.movie;
            break;
        default:
            totalCount = lengths.all;
            break;
    }

    const [currentCount, setCurrentCount] = useState(
        totalCount < 20 ? totalCount : 20
    );

    useEffect(() => {
        if (loadMore) {
            const loadMoreContent = async () => {
                let moreContent;

                if (keyword) {
                    moreContent = await keywordSearch(
                        query,
                        cat,
                        `${shownPageNumbers + 1}`
                    );
                } else if (genre) {
                    moreContent = await genreSearch(
                        query,
                        cat,
                        `${shownPageNumbers + 1}`
                    );
                } else {
                    moreContent = await doASearch(
                        query,
                        cat,
                        shownPageNumbers + 1
                    );
                }

                setShownPageNumbers(shownPageNumbers + 1);
                setCurrentCount(currentCount + moreContent.results.length);

                setFinalData(finalData.concat(moreContent.results));
                setLoadMore(false);
            };
            loadMoreContent();
        }
        console.log(shownPageNumbers);
    }, [
        finalData,
        loadMore,
        cat,
        genre,
        keyword,
        query,
        shownPageNumbers,
        currentCount,
    ]);

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="@container">
                <LargeCreditsList
                    data={finalData}
                    type={cat}
                    search={false}
                    credits={false}
                    seasons={false}
                    clip={false}
                />
            </div>
            <div className="flex flex-col gap-4">
                {finalData.length > 20 && (
                    <button
                        onClick={scrollToTop}
                        className="self-end px-8 bg-slate-700 py-2 hover:bg-slate-900"
                    >
                        Back To Top
                    </button>
                )}
                {finalData.length >= 20 && currentCount != totalCount && (
                    <button
                        className="w-full bg-slate-700 py-2 hover:bg-brand-blue hover:text-slate-950 hover:font-bold"
                        onClick={() => setLoadMore(true)}
                    >
                        Load More
                        <p className="text-sm font-normal">
                            {currentCount} / {totalCount}
                        </p>
                    </button>
                )}
            </div>
        </div>
    );
}
