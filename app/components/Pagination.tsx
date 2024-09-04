'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function Pagination(props: {
    page: number;
    totalPages: number;
    cat: string;
    query?: string;
    content?: string;
    search: boolean;
    keyword: boolean;
    genre: boolean;
}) {
    const page = props.page;
    const [paginationRange, setPaginationRange] = useState<any[]>();
    const [backUrl, setBackUrl] = useState('');
    const [nextUrl, setNextUrl] = useState('');

    function range(start: number, end: number) {
        let length = end - start + 1;
        return Array.from({ length }, (v: unknown, idx: number) => idx + start);
    }

    console.log(props.cat);
    console.log(props.keyword);
    console.log(props.content);
    console.log(props.genre);
    console.log(props.search);

    useMemo(() => {
        if (6 >= props.totalPages) {
            setPaginationRange(range(1, props.totalPages));
        }

        if (props.search && !props.keyword && !props.genre) {
            setBackUrl(
                `/search/${props.cat}?query=${props.query}&page=${page - 1}`
            );
            setNextUrl(
                `/search/${props.cat}?query=${props.query}&page=${props.page + 1}`
            );
        } else if (props.keyword) {
            setBackUrl(
                `/search/keyword-${props.cat}?query=${props.query}&page=${page - 1}`
            );
            setNextUrl(
                `/search/keyword-${props.cat}?query=${props.query}&page=${props.page + 1}`
            );
        } else if (props.genre && props.query) {
            setBackUrl(
                `/search/genre-${props.cat}?query=${encodeURIComponent(props.query)}&page=${page - 1}`
            );
            setNextUrl(
                `/search/genre-${props.cat}?query=${encodeURIComponent(props.query)}&page=${props.page + 1}`
            );
        } else {
            setBackUrl(`/${props.content}/${props.cat}/${+page - 1}`);
            setNextUrl(`/${props.content}/${props.cat}/${+page + 1}`);
        }

        const leftSiblingIndex = Math.max(props.page - 1, 1);
        const rightSiblingIndex = Math.min(props.page + 1, props.totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 1;
        const shouldShowRightDots = rightSiblingIndex < props.totalPages - 1;

        const firstPageIndex = 1;
        const lastPageIndex = props.totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2;
            let leftRange = range(1, leftItemCount);

            setPaginationRange([...leftRange, '...', props.totalPages]);
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2;
            let rightRange = range(
                props.totalPages - rightItemCount + 1,
                props.totalPages
            );
            setPaginationRange([firstPageIndex, '...', ...rightRange]);
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            setPaginationRange([
                firstPageIndex,
                '...',
                ...middleRange,
                '...',
                lastPageIndex,
            ]);
        }
    }, [props.totalPages, props.page]);

    return (
        <div className="flex justify-center my-4">
            <div className="w-full h-full flex justify-center">
                <ul className="flex gap-6 items-center  pointer">
                    <li key="previous" className="grid items-center">
                        {+page > 1 && (
                            <Link
                                className="h-full flex gap-2 justify-start items-center ps-2 py-1"
                                href={backUrl}
                            >
                                <p className="text-3xl font-bold mb-1">
                                    &#171;
                                </p>
                            </Link>
                        )}
                    </li>
                    {paginationRange?.map((num: any, index: number) => (
                        <>
                            {num === '...' ?
                                <li key={index}>...</li>
                            :   <li key={index}>
                                    <Link
                                        href={
                                            props.keyword ?
                                                `/search/keyword-${props.cat}?query=${props.query}&page=${num}`
                                            : props.genre ?
                                                `/search/genre-${props.cat}?query=${props.query}&page=${num}`
                                            : props.search ?
                                                `/search/${props.cat}?query=${props.query}&page=${num}`
                                            :   `/${props.content}/${props.cat}/${num}`

                                        }
                                        className={`${num === page && 'underline underline-offset-2'}`}
                                    >
                                        {num}
                                    </Link>
                                </li>
                            }
                        </>
                    ))}
                    <li
                        key="next"
                        className="grid items-center justify-end h-full"
                    >
                        {+page < +props.totalPages && (
                            <Link
                                className="h-full flex gap-2 justify-end items-center pe-2 py-1"
                                href={nextUrl}
                            >
                                <p className="text-3xl font-bold mb-1">
                                    &#187;
                                </p>
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}
