'use client';

import { Key, useEffect, useState } from 'react';
import { getContent, getFavorWatch } from '@/app/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
    sessionId?: string;
    accountId?: string;
    content: string;
    cat: string;
};

export default function ContentList({
    sessionId,
    accountId,
    content,
    cat,
}: Props) {
    const router = useRouter();
    const [contentList, setContentList] = useState<Movie[] | Show[]>();

    const [isHovering, setIsHovered] = useState(false);
    const [scrollPx, setScrollPx] = useState(0);
    const [scrollWidth, setScrollWidth] = useState(2000);
    const [elWidth, setElWidth] = useState(0);
    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    let capCat: string;

    useEffect(() => {
        async function retrieveContent() {
            console.log('retrieving content');
            if (cat === 'favorite' && accountId && sessionId) {
                let favorites = await getFavorWatch(
                    sessionId,
                    cat,
                    accountId,
                    content
                );
                setContentList(favorites);
            } else if (cat === 'watchlist' && accountId && sessionId) {
                let watchlist = await getFavorWatch(
                    sessionId,
                    cat,
                    accountId,
                    content
                );
                setContentList(watchlist);
            } else {
                let cont = await getContent(content, cat, 1);
                setContentList(cont.results);
            }
        }
        retrieveContent();
    }, [sessionId, accountId, cat, content]);

    //capitalize category
    if (cat.includes('_')) {
        let array = cat.split('_');
        let firstLetterCap = array[0].slice(0, 1).toUpperCase();
        let secondLetterCap = array[1].slice(0, 1).toUpperCase();
        array[0] = firstLetterCap + array[0].slice(1);
        array[1] = secondLetterCap + array[1].slice(1);
        capCat = array.join(' ');
    } else {
        let capLetter = cat.slice(0, 1).toUpperCase();
        if (cat === 'favorites') {
            capCat = capLetter + cat.slice(1, -1);
            if (content === 'movie') {
                capCat = capCat + ' ' + content + 's';
            } else {
                capCat = capCat + ' ' + content + ' shows';
            }
        } else if (cat === 'watchlist') {
            capCat = capLetter + cat.slice(1);
            let capLetterCont = content.slice(0, 1).toUpperCase();
            capCat = capLetterCont + content.slice(1) + ' ' + capCat;
        } else {
            capCat = capLetter + cat.slice(1);
        }
    }

    //scroll through content
    function scrollDiv(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const target = event.currentTarget as HTMLButtonElement;
        const direction = target.id;
        let scrollCont = target.parentElement;

        if (scrollCont) {
            //total width of element - total amount of scrolling
            setScrollWidth(scrollCont.scrollWidth);

            //the width of the element within the client view
            setElWidth(scrollCont.clientWidth);

            if (direction === 'forward') {
                scrollCont?.scrollBy({
                    left: window.innerWidth - 120,
                    behavior: 'smooth',
                });
            } else if (direction === 'back') {
                scrollCont?.scrollBy({
                    left: -window.innerWidth + 120,
                    behavior: 'smooth',
                });
            }

            //because smooth scroll behavior takes time
            setTimeout(() => {
                setScrollPx(scrollCont.scrollLeft + scrollCont.clientWidth);
            }, 500);
        }
    }

    return (
        <div className="flex flex-col my-8">
            <div
                className="relative h-min grid gap-y-4 px-8"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <h2>{capCat}</h2>
                {contentList && contentList.length > 0 ?
                    <ul
                        id="scroll-cont"
                        className="grid grid-flow-col overflow-x-scroll snap-x"
                    >
                        {contentList.map(
                            (
                                ent: Movie | Show,
                                index: Key | null | undefined
                            ) => (
                                <li
                                    data-num={index}
                                    className="min-w-56 grid px-2 snap-start"
                                    key={index}
                                >
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/${content === 'movies' ? 'movie' : content}/${ent.id.toString()}`
                                            )
                                        }
                                    >
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w200${ent.poster_path}`}
                                            alt={`${content} poster`}
                                            width={200}
                                            height={300}
                                        />
                                    </button>
                                </li>
                            )
                        )}
                        {isHovering && (
                            <>
                                {scrollPx >= scrollWidth || (
                                    <button
                                        id="forward"
                                        onClick={scrollDiv}
                                        className="absolute row-start-2 right-0 h-full bg-slate-900/70"
                                    >
                                        <svg
                                            fill="#ffffff"
                                            width="30px"
                                            height="30px"
                                            viewBox="-8.5 0 32 32"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title>next</title>
                                            <path d="M0 24.781v-17.594l15.281 8.813z"></path>
                                        </svg>
                                    </button>
                                )}
                                {scrollPx == elWidth || (
                                    <button
                                        id="back"
                                        onClick={scrollDiv}
                                        className="absolute row-start-2 left-0 h-full bg-slate-900/70"
                                    >
                                        <svg
                                            fill="#ffffff"
                                            width="30px"
                                            height="30px"
                                            viewBox="-8.5 0 32 32"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title>back</title>
                                            <path d="M15.281 7.188v17.594l-15.281-8.781z"></path>
                                        </svg>
                                    </button>
                                )}
                            </>
                        )}
                    </ul>
                :   <p className="h-60 grid place-items-center">
                        Add some {content} to your {cat}!
                    </p>
                }
            </div>
            {contentList && contentList.length == 20 && (
                <button
                    onClick={() => router.push(`/${content}/${cat}/1`)}
                    className="self-end my-8 px-8"
                >
                    See More
                </button>
            )}
        </div>
    );
}
