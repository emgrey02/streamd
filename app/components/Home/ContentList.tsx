'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fromURLToTitle } from '../../utils';
import ContentListNav from './ContentListNav';

/**
 * Scrollable movie/show/people content
 */
interface ContentListProps {
    /**title of the content being shown in this list */
    title: string;
    /** an array of possible categories for this content, to be shown in the navigation bar */
    cat: string[];
    /** the content itself, each element is the content for each category, the content itself is an array of objects */
    content: ContentItem[][];
}
export default function ContentList({ title, cat, content }: ContentListProps) {
    const router = useRouter();
    const [contentList, setContentList] = useState<ContentItem[]>(content[0]);
    const [scrollPx, setScrollPx] = useState(0);
    const [scrollWidth, setScrollWidth] = useState(2000);
    const [category, setCategory] = useState(cat[0]);
    const [progress, setProgress] = useState(0);
    const scrollCont = useRef<HTMLUListElement>(null);

    async function setContent(e: React.MouseEvent<HTMLButtonElement>) {
        const newCat = e.currentTarget.dataset.cat;

        if (newCat) {
            const index = cat.indexOf(newCat);
            setCategory(newCat);
            setContentList(content[index]);
            scrollToBeginning();
        }
    }

    function scrollToBeginning() {
        if (scrollCont.current) {
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
                    {fromURLToTitle(title)}
                </h2>
                <ContentListNav
                    currentCategory={category}
                    categoryOptions={cat}
                    setContent={setContent}
                />
                <div className="relative grid sm:grid-cols-[35px_auto_35px] py-4 sm:px-2">
                    <button
                        id="back"
                        onClick={scrollDiv}
                        disabled={scrollPx == 0}
                        className={`h-full bg-slate-900 disabled:bg-slate-800 disabled:ring-1 disabled:ring-slate-900 hover:bg-slate-950 hidden sm:block p-1 transition text-4xl text-slate-400 ${scrollPx == 0 && 'text-slate-700'}`}
                    >
                        &#171;
                    </button>
                    {contentList && contentList.length > 0 && (
                        <ul
                            id="scroll-cont"
                            className="flex items-start overflow-x-scroll snap-x mx-2 gap-1"
                            ref={scrollCont}
                        >
                            {contentList.map(
                                (ent: ContentItem, index: number) => (
                                    <li
                                        data-num={index}
                                        className="min-w-50 grid snap-start py-1 px-1"
                                        key={index}
                                    >
                                        <button
                                            className="focus:outline-none focus:ring focus:ring-brand-blue"
                                            onClick={() =>
                                                router.push(
                                                    `/${ent.media_type || title}/${ent.id.toString()}`
                                                )
                                            }
                                        >
                                            {(
                                                ent.poster_path ||
                                                ent.profile_path
                                            ) ?
                                                <Image
                                                    src={`https://image.tmdb.org/t/p/w200${ent.poster_path || ent.profile_path}`}
                                                    alt={`${ent.poster_path ? 'Poster for' : 'Profile of'} ${ent.name || ent.title}`}
                                                    width={200}
                                                    height={300}
                                                />
                                            :   <div className="w-48 h-72 bg-slate-300/20 grid place-items-center">
                                                    {title === 'tv' ?
                                                        ent.name
                                                    :   ent.title}{' '}
                                                    poster unavailable
                                                </div>
                                            }
                                        </button>
                                    </li>
                                )
                            )}
                        </ul>
                    )}
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
                    onClick={() =>
                        router.push(
                            `/${fromURLToTitle(title)?.toLowerCase()}/${category}`
                        )
                    }
                    className="self-end mt-2 px-2"
                >
                    See More
                </button>
            )}
        </div>
    );
}
