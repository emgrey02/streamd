'use client';

import { useEffect, useState } from 'react';
import ContentPage from './ContentPage';
import { doASearch, genreSearch, keywordSearch } from '../actions';
import LargeCreditsList from './LargeCreditsList';

export default function SearchResults(props: {
    keyword?: string;
    genre?: string;
    query: string;
    cat: string;
    data: any;
}) {
    const [loadMore, setLoadMore] = useState(false);
    const [shownPageNumbers, setShownPageNumbers] = useState(1);
    const [finalData, setFinalData] = useState(props.data);

    console.log(props.data);

    console.log(props.cat);
    console.log(props.query);

    useEffect(() => {
        if (loadMore) {
            const loadMoreContent = async () => {
                let moreContent;
                if (props.keyword) {
                    moreContent = await keywordSearch(
                        props.query,
                        props.cat,
                        `${shownPageNumbers + 1}`
                    );
                } else if (props.genre) {
                    moreContent = await genreSearch(
                        props.query,
                        props.cat,
                        `${shownPageNumbers + 1}`
                    );
                } else {
                    moreContent = await doASearch(
                        props.query,
                        props.cat,
                        shownPageNumbers + 1
                    );
                }
                setShownPageNumbers(shownPageNumbers + 1);
                console.log(moreContent);
                console.log(finalData.concat(moreContent.results));

                setFinalData(finalData.concat(moreContent.results));
                setLoadMore(false);
            };
            loadMoreContent();
        }
        console.log(shownPageNumbers);
    }, [finalData, loadMore, props.cat, props.query, shownPageNumbers]);

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="@container">
                <LargeCreditsList
                    data={finalData}
                    type={props.cat}
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
        </div>
    );
}
