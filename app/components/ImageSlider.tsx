'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ImageSlider(props: {
    images: any;
    type: 'Backdrops' | 'Posters' | 'Logos';
}) {
    const images = props.images;
    const [slideNum, setSlideNum] = useState(0);
    let heights = '';
    let widths: { selected: string; default: string };

    switch (props.type) {
        case 'Backdrops':
            heights = 'h-[46px] md:h-[90px]';
            widths = {
                selected: 'w-[75px] md:w-[150px]',
                default: 'w-[50px] md:w-[100px]',
            };
            break;
        case 'Posters':
            heights = 'h-[100px] md:h-[150px]';
            widths = {
                selected: 'w-[60px] md:w-[100px]',
                default: 'w-[50px] md:w-[70px]',
            };
            break;
        case 'Logos':
            heights = 'h-[70px] md:h-[100px]';
            widths = {
                selected: 'w-[60px] md:w-[100px]',
                default: 'w-[50px] md:w-[70px]',
            };
        default:
            break;
    }

    useEffect(() => {
        let windowWidth = window.innerWidth;
        let middle = windowWidth / 2;

        let selectedEl: HTMLElement | null = document.querySelector(
            `#${props.type} li:nth-child(${slideNum + 1})`
        );
        let scrollCont = selectedEl?.parentElement;

        if (selectedEl && scrollCont) {
            let elWidth = selectedEl.offsetWidth;
            let elCenter =
                selectedEl.getBoundingClientRect().left + elWidth / 2;

            let totalContWidth = scrollCont.scrollWidth;
            let currentScrollDistance = scrollCont.scrollLeft;
            let maxScrollDistance = totalContWidth - scrollCont.clientWidth;

            if (
                elCenter >= middle &&
                currentScrollDistance !== maxScrollDistance
            ) {
                scrollCont.scrollBy({
                    left: elCenter - middle,
                    behavior: 'smooth',
                });
            }

            if (elCenter < middle && currentScrollDistance !== 0) {
                scrollCont.scrollBy({
                    left: -(middle - elCenter),
                    behavior: 'smooth',
                });
            }
        }
    }, [props.type, slideNum]);

    return (
        <>
            {images.length > 0 && (
                <div className="col-span-2">
                    <h2 className="text-lg mb-2 font-medium">{props.type}</h2>
                    <div className="bg-slate-950/80 px-4 py-6 md:py-10 md:px-8">
                        <ul
                            id={props.type}
                            className={`flex overflow-x-scroll overflow-y-clip gap-4 ${heights}`}
                        >
                            {images.map((i: any, index: number) => (
                                <li key={index}>
                                    <button
                                        className={`${slideNum === index ? widths.selected : widths.default} transition-all`}
                                        onClick={() => setSlideNum(index)}
                                    >
                                        <Image
                                            className={`${slideNum === index && 'bg-slate-100/70'} p-1`}
                                            src={`https://image.tmdb.org/t/p/w200/${i.file_path}`}
                                            alt={`backdrop image`}
                                            width="150"
                                            height="1080"
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-center mt-4">
                            <button
                                className="text-xl md:text-3xl lg:text-6xl disabled:text-slate-700 bg-slate-900/70 my-4 px-4"
                                onClick={() => setSlideNum(slideNum - 1)}
                                disabled={!images[`${slideNum - 1}`]}
                            >
                                &#171;
                            </button>
                            <ul className="grid place-items-center">
                                {images && images[`${slideNum}`] && (
                                    <li className="w-full">
                                        <Image
                                            className="w-full px-8 max-h-[calc(100vh-200px)]"
                                            src={`https://image.tmdb.org/t/p/w1280/${images[`${slideNum}`].file_path}`}
                                            alt={`backdrop image`}
                                            width="1280"
                                            height="1080"
                                        />
                                    </li>
                                )}
                            </ul>
                            <button
                                className="text-xl md:text-3xl lg:text-6xl disabled:text-slate-700 bg-slate-900/70 my-4 px-4"
                                onClick={() => setSlideNum(slideNum + 1)}
                                disabled={!images[`${slideNum + 1}`]}
                            >
                                &#187;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
