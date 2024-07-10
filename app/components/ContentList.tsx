'use client';

import { Key, useEffect, useState } from 'react';
import { getContent, getFavorWatchRated } from '@/app/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
    sessionId?: string;
    accountId?: string;
    content: string;
    cat: string[] | string;
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
    const [category, setCategory] = useState(cat || cat[0]);
    const [elWidth, setElWidth] = useState(0);
    const [message, setMessage] = useState('Loading...');
    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    let capCat: string;
    console.log(content);
    console.log(cat);

    useEffect(() => {
        async function retrieveContent() {
            if (accountId && sessionId) {
                if (content === 'favorite') {
                    let favorites = await getFavorWatchRated(
                        sessionId,
                        content,
                        accountId,
                        cat[0]
                    );
                    setCategory(cat[0]);
                    setContentList(favorites);
                    setMessage(`Favorite some movies!`);
                } else if (content === 'watchlist') {
                    let watchlist = await getFavorWatchRated(
                        sessionId,
                        content,
                        accountId,
                        cat[0]
                    );
                    setCategory(cat[0]);
                    setContentList(watchlist);
                    setMessage(`Add some movies to your Watchlist!`);
                } else if (content === 'rated') {
                    let rated = await getFavorWatchRated(
                        sessionId,
                        content,
                        accountId,
                        cat[0]
                    );
                    setCategory(cat[0]);
                    setContentList(rated);
                    setMessage(`Rate some movies!`);
                }
            } else {
                let cont = await getContent(content, cat[0], 1);
                setCategory(cat[0]);
                setContentList(cont.results);
            }
        }
        retrieveContent();
    }, [sessionId, accountId, cat, content]);

    async function setContent(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        let newCat = e.currentTarget.dataset.cat;
        let cont;
        if (
            content === 'favorite' ||
            content === 'watchlist' ||
            content === 'rated'
        ) {
            if (sessionId && accountId && newCat) {
                cont = await getFavorWatchRated(
                    sessionId,
                    content,
                    accountId,
                    newCat
                );
                if (newCat) {
                    setMessage(`Add some ${newCat}s to your ${content}`);
                    if (newCat === 'movies') newCat = 'movie';
                    setCategory(newCat);
                    setContentList(cont);
                }
            }
        } else {
            cont = await getContent(content, newCat, 1);
            if (newCat) {
                if (newCat === 'movies') newCat = 'movie';
                setCategory(newCat);
                setContentList(cont.results);
            }
        }
    }

    function capitalizeCategory(cat: string) {
        if (cat.includes('_')) {
            let array = cat.split('_');
            let firstLetterCap = array[0].slice(0, 1).toUpperCase();
            let secondLetterCap = array[1].slice(0, 1).toUpperCase();
            array[0] = firstLetterCap + array[0].slice(1);
            array[1] = secondLetterCap + array[1].slice(1);
            return `${array.join(' ')}`;
        } else {
            let capLetter = cat.slice(0, 1).toUpperCase();
            capCat = `${capLetter}${cat.slice(1)}`;
            if (capCat === 'Movie') capCat = 'Movies';
            return capCat;
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
            //wait for it to scroll and then set
            setTimeout(() => {
                setScrollPx(scrollCont.scrollLeft + scrollCont.clientWidth);
            }, 500);
        }
    }

    return (
        <div className="flex flex-col">
            <div
                className="relative h-min grid gap-y-4 px-2 md:px-8"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <h2>{capitalizeCategory(content)}</h2>
                <ul
                    className={`grid ${content === 'favorite' || content === 'watchlist' || content === 'rated' ? 'grid-cols-2 max-w-[400px]' : 'grid-cols-4 max-w-[600px]'} items-center ring-1 ring-gray-900 bg-slate-700/40 `}
                >
                    {Array.isArray(cat) &&
                        cat.map((c: string, index: number) => (
                            <li
                                key={index}
                                className={`h-full ${c === category && 'bg-slate-900'} border-s-2 ${c === category ? 'border-slate-400' : 'border-slate-600'} transition-all`}
                            >
                                <button
                                    className={`grid justify-start items-center px-3 py-2 min-w-full h-full`}
                                    data-cat={c}
                                    onClick={setContent}
                                >
                                    {capitalizeCategory(c)}
                                </button>
                            </li>
                        ))}
                </ul>
                {contentList && contentList.length > 0 ?
                    <ul
                        id="scroll-cont"
                        className="flex items-start overflow-x-scroll snap-x"
                    >
                        {contentList.map((ent: any, index: number) => (
                            <li
                                data-num={index}
                                className="min-w-56 grid px-2 snap-start"
                                key={index}
                            >
                                <button
                                    onClick={() =>
                                        router.push(
                                            `/${ent.media_type || (content === 'favorite' || content === 'watchlist' || content === 'rated' ? category : content)}/${ent.id.toString()}`
                                        )
                                    }
                                >
                                    {ent.poster_path || ent.profile_path ?
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w200${ent.poster_path || ent.profile_path}`}
                                            alt={`${content} poster`}
                                            width={200}
                                            height={300}
                                        />
                                    :   <div className="w-48 h-72 bg-slate-300/20 grid place-items-center">
                                            {content === 'tv' ?
                                                ent.name
                                            :   ent.title}{' '}
                                            poster unavailable
                                        </div>
                                    }
                                </button>
                            </li>
                        ))}
                        {isHovering && (
                            <>
                                {scrollPx >= scrollWidth || (
                                    <button
                                        id="forward"
                                        onClick={scrollDiv}
                                        className="absolute row-start-3 right-0 h-full bg-slate-900/70"
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
                                        className="absolute row-start-3 left-0 h-full bg-slate-900/70"
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
                :   <p className="h-60 grid place-items-center">{message}</p>}
            </div>
            {contentList && contentList.length == 20 && (
                <button
                    onClick={() => router.push(`/${content}/${category}/1`)}
                    className="self-end mt-4 px-8"
                >
                    See More
                </button>
            )}
        </div>
    );
}
