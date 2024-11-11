'use client';
import { useEffect, useState } from 'react';
import { getContent } from '../actions';
import LargeCreditsList from './LargeCreditsList';

export default function ContentPage(props: {
    data: any;
    pageNum: number;
    type: string;
    cat: string;
    content: string;
}) {
    const [loadMore, setLoadMore] = useState(false);
    const [finalData, setFinalData] = useState<any>(props.data);
    const [shownPageNumbers, setShownPageNumbers] = useState(1);

    console.log(props.data);

    useEffect(() => {
        if (loadMore) {
            const loadMoreContent = async () => {
                let moreContent = await getContent(
                    props.content,
                    props.cat,
                    shownPageNumbers + 1
                );
                setShownPageNumbers(shownPageNumbers + 1);
                console.log(moreContent);
                console.log(finalData.concat(moreContent.results));

                setFinalData(finalData.concat(moreContent.results));
                setLoadMore(false);
            };
            loadMoreContent();
        }
    }, [
        loadMore,
        props.cat,
        props.content,
        props.pageNum,
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
