'use client';
import { useEffect, useState } from 'react';
import { getContent } from '../../actions';
import LargeCreditsList from '@/app/components/Lists/LargeCreditsList';

/**
 * Page that shows a large list of movies, shows, or trending content
 */
type ContentPageItem = MovieItem | ShowItem | ContentItem;

interface ContentPageProps {
    /** the data to be shown on this page, an array of movies, shows, or both (trending) */
    data: ContentPageItem[];
    /** the type of content shown on this page - movies, tv, or trending (multi) */
    type: string;
    /** the current category of content being shown */
    cat: string;
}

export default function ContentPage({ data, type, cat }: ContentPageProps) {
    const [loadMore, setLoadMore] = useState(false);
    const [finalData, setFinalData] = useState<ContentPageItem[]>(data);
    const [shownPageNumbers, setShownPageNumbers] = useState(1);

    console.log(type);
    console.log(cat);

    useEffect(() => {
        if (loadMore) {
            console.log('button pressed');
            const loadMoreContent = async () => {
                const moreContent = await getContent(
                    type,
                    cat,
                    shownPageNumbers + 1
                );
                setShownPageNumbers(shownPageNumbers + 1);
                setFinalData((prev) =>
                    prev.concat(moreContent.results as ContentPageItem[])
                );
                setLoadMore(false);
            };
            loadMoreContent();
        }
    }, [loadMore, cat, type, data, shownPageNumbers, finalData]);

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <>
            <div className="@container">
                <LargeCreditsList
                    data={finalData}
                    type={type}
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
                <button
                    className="w-full bg-slate-700 py-2 hover:bg-brand-blue hover:text-slate-950 hover:font-bold"
                    onClick={() => {
                        console.log('button clicked');
                        setLoadMore(true);
                    }}
                >
                    Load More
                </button>
            </div>
        </>
    );
}
