'use client';

import { Key, useEffect, useState } from 'react';
import { getMovies } from '@/app/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

type Props = {
    cat: string;
};

export default function MovieList({ cat }: Props) {
    const router = useRouter();
    const [movieList, setMovieList] = useState<Movie[]>();
    const [isHovering, setIsHovered] = useState(false);
    const [scrollPx, setScrollPx] = useState(0);
    const [scrollWidth, setScrollWidth] = useState(2000);
    const [elWidth, setElWidth] = useState(0);
    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    let capCat: string;

    async function retrieveMovies() {
        let movies = await getMovies(cat, 1);
        setMovieList(movies.results);
    }

    useEffect(() => {
        retrieveMovies();
    }, []);

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
        capCat = capLetter + cat.slice(1);
    }

    //scroll through movies
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
            <div className="relative h-min grid gap-y-4 ">
                <h2>{capCat}</h2>
                {movieList && movieList.length >= 1 && (
                    <ul
                        id="scroll-cont"
                        className="grid grid-flow-col overflow-x-scroll h-min"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {movieList.map(
                            (movie: Movie, index: Key | null | undefined) => (
                                <li
                                    data-num={index}
                                    className="min-w-56 grid px-2"
                                    key={index}
                                >
                                    <h3>{movie.title}</h3>
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/movie/${movie.id.toString()}`
                                            )
                                        }
                                    >
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt="movie poster"
                                            width={200}
                                            height={300}
                                        />
                                    </button>
                                    <p>{movie.release_date}</p>
                                </li>
                            )
                        )}
                        {isHovering && (
                            <>
                                {scrollPx >= scrollWidth || (
                                    <button
                                        id="forward"
                                        onClick={scrollDiv}
                                        className="absolute row-start-2 right-0 h-full bg-slate-800/50"
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
                                        className="absolute row-start-2 left-0 h-full bg-slate-800/50"
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
                )}
            </div>
            <button
                onClick={() => router.push(`/${cat}/1`)}
                className="self-end my-8"
            >
                See More
            </button>
        </div>
    );
}
