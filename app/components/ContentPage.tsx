'use client';
import { useEffect, useState } from 'react';
import { getContent } from '../actions';
import LargeCreditsList from './LargeCreditsList';

/**
 *
 * @param props
 * data: an array of movies, shows, or both (trending)
 * type: content type, either { movie, tv, trending } as a string
 * cat: category based on the type { string }
 * @returns
 */
type ContentPageItem = MovieItem | ShowItem | ContentItem;

export default function ContentPage(props: {
    data: ContentPageItem[];
    type: string;
    cat: string;
}) {
    const [loadMore, setLoadMore] = useState(false);
    const [finalData, setFinalData] = useState<ContentPageItem[]>(props.data);
    const [shownPageNumbers, setShownPageNumbers] = useState(1);

    console.log(props.type);

    useEffect(() => {
        if (loadMore) {
            const loadMoreContent = async () => {
                const moreContent = await getContent(
                    props.type,
                    props.cat,
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
    }, [
        loadMore,
        props.cat,
        props.type,
        props.data,
        shownPageNumbers,
        finalData,
    ]);

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <>
            <div className="@container">
                <LargeCreditsList
                    data={finalData}
                    type={props.type}
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
                    onClick={() => setLoadMore(true)}
                >
                    Load More
                </button>
            </div>
        </>
    );
}
