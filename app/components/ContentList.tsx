'use client';

import { useEffect, useState, useRef } from 'react';
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
    const [scrollPx, setScrollPx] = useState(0);
    const [scrollWidth, setScrollWidth] = useState(2000);
    const [category, setCategory] = useState(cat || cat[0]);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Loading...');
    const scrollCont = useRef<HTMLUListElement>(null);
    console.log(content);

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
                    setCategory(newCat);
                    setContentList(cont);
                    scrollToBeginning();
                }
            }
        } else {
            cont = await getContent(content, newCat, 1);
            if (newCat) {
                setCategory(newCat);
                setContentList(cont.results);
                scrollToBeginning();
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

            if (array[2]) {
                let thirdLetterCap = array[2]?.slice(0, 1).toUpperCase();
                array[2] = thirdLetterCap + array[2]?.slice(1);
            }

            return `${array.join(' ')}`;
        } else {
            let capLetter = cat.slice(0, 1).toUpperCase();
            let capCat = `${capLetter}${cat.slice(1)}`;
            if (capCat === 'Movie') capCat = 'Movies';
            if (capCat === 'Favorite') capCat = 'Favorites';
            return capCat;
        }
    }

    function scrollToBeginning() {
        if (scrollCont.current) {
            console.log('scrolling to beginning');
            console.log(scrollPx);
            scrollCont.current.scrollBy({
                left: -scrollPx,
                behavior: 'smooth',
            });
            setTimeout(() => {
                if (scrollCont.current) {
                    setScrollPx(0);
                    setProgress(0);
                }
            }, 700);
        }
    }

    //scroll through content
    function scrollDiv(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const target = event.currentTarget as HTMLButtonElement;
        const direction = target.id;

        if (scrollCont.current) {
            //total width of element - total amount of scrolling
            setScrollWidth(scrollCont.current.scrollWidth);

            if (direction === 'forward') {
                scrollCont.current.scrollBy({
                    left: scrollCont.current.clientWidth,
                    behavior: 'smooth',
                });
            } else if (direction === 'back') {
                scrollCont.current.scrollBy({
                    left: -scrollCont.current.clientWidth,
                    behavior: 'smooth',
                });
            }

            //because smooth scroll behavior takes time
            //wait for it to scroll and then set
            setTimeout(() => {
                if (scrollCont.current) {
                    if (scrollCont.current.scrollLeft < 100) {
                        scrollCont.current.scrollLeft = 0;
                    }
                    setScrollPx(scrollCont.current.scrollLeft);
                    setProgress(
                        scrollCont.current.scrollLeft +
                            scrollCont.current.clientWidth
                    );
                }
            }, 700);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-min grid gap-y-4">
                <h2 className="text-xl font-medium tracking-wider">
                    {capitalizeCategory(content)}
                </h2>
                <ul
                    className={`grid ${content === 'favorite' || content === 'watchlist' || content === 'rated' ? 'grid-cols-2 max-w-[400px]' : 'grid-cols-4 max-w-[600px]'} items-center ring-1 ring-gray-900 bg-slate-700/40`}
                >
                    {Array.isArray(cat) &&
                        cat.map((c: string, index: number) => (
                            <li
                                key={index}
                                className={`h-full ${c === category && 'bg-slate-900'} border-s-2 ${c === category ? 'border-slate-400' : 'border-slate-600'} transition-all `}
                            >
                                <button
                                    className={`grid justify-start items-center px-3 py-2 min-w-full h-full focus:outline-none focus:ring focus:ring-brand-blue`}
                                    data-cat={c}
                                    onClick={setContent}
                                >
                                    {capitalizeCategory(c)}
                                </button>
                            </li>
                        ))}
                </ul>
                <div className="relative grid sm:grid-cols-[35px_auto_35px] py-4 sm:px-2">
                    <button
                        id="back"
                        onClick={scrollDiv}
                        disabled={scrollPx == 0}
                        className={`h-full bg-slate-900 disabled:bg-slate-800 disabled:ring-1 disabled:ring-slate-900 hover:bg-slate-950 hidden sm:block p-1 transition text-4xl text-slate-400 ${scrollPx == 0 && 'text-slate-700'}`}
                    >
                        &#171;
                    </button>
                    {contentList && contentList.length > 0 ?
                        <ul
                            id="scroll-cont"
                            className="flex items-start overflow-x-scroll snap-x mx-2 gap-1"
                            ref={scrollCont}
                        >
                            {contentList.map((ent: any, index: number) => (
                                <li
                                    data-num={index}
                                    className="min-w-[200px] grid snap-start py-1 px-1"
                                    key={index}
                                >
                                    <button
                                        className="focus:outline-none focus:ring focus:ring-brand-blue"
                                        onClick={() =>
                                            router.push(
                                                `/${ent.media_type || (content === 'favorite' || content === 'watchlist' || content === 'rated' ? category : content)}/${ent.id.toString()}`
                                            )
                                        }
                                    >
                                        {ent.poster_path || ent.profile_path ?
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${ent.poster_path || ent.profile_path}`}
                                                alt={`${ent.poster_path ? 'Poster for' : 'Profile of'} ${ent.name || ent.title}`}
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
                        </ul>
                    :   <p className="h-60 grid place-items-center">
                            {message}
                        </p>
                    }
                    <button
                        id="forward"
                        onClick={scrollDiv}
                        disabled={progress == scrollWidth}
                        className={`h-full bg-slate-900 disabled:bg-slate-800 disabled:ring-1 disabled:ring-slate-900 hover:bg-slate-950 hidden sm:block p-1 transition text-4xl text-slate-400 ${progress == scrollWidth && 'text-slate-700'}`}
                    >
                        &#187;
                    </button>
                </div>
            </div>
            {contentList && contentList.length == 20 && (
                <button
                    onClick={() => router.push(`/${content}/${category}/1`)}
                    className="self-end mt-2 px-2"
                >
                    See More
                </button>
            )}
        </div>
    );
}
