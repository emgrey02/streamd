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
        const target = event.target as HTMLButtonElement;
        const direction = target.id;
        if (direction === 'forward') {
            let scrollCont = target.previousElementSibling;
            scrollCont?.scrollBy({
                left: window.innerWidth - 120,
                behavior: 'smooth',
            });
        } else if (direction === 'back') {
            let scrollCont =
                target.previousElementSibling?.previousElementSibling;
            scrollCont?.scrollBy({
                left: -window.innerWidth + 120,
                behavior: 'smooth',
            });
        }
    }

    return (
        <>
            <div
                className="relative h-min my-16 flex flex-col"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <h2>{capCat}</h2>
                {movieList && movieList.length >= 1 && (
                    <ul
                        id="scroll-cont"
                        className="grid grid-flow-col overflow-x-scroll h-min"
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
                    </ul>
                )}
                {isHovering && (
                    <>
                        <button
                            id="forward"
                            onClick={scrollDiv}
                            className="absolute right-0 top-1/2"
                        >
                            slide
                        </button>
                        <button
                            id="back"
                            onClick={scrollDiv}
                            className="absolute left-0 top-1/2"
                        >
                            slide
                        </button>
                    </>
                )}
                <button
                    onClick={() => router.push(`/${cat}/1`)}
                    className="self-end py-4"
                >
                    See More
                </button>
            </div>
        </>
    );
}
