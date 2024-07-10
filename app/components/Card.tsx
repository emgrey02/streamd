'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Card(props: {
    data: any;
    type?: string;
    search: boolean;
    credits: boolean;
}) {
    const [windowWidth, setWindowWidth] = useState<number>(getWindowWidth());
    const p = props.data;
    let type = props.type;

    function getWindowWidth() {
        const width = window.innerWidth;
        return width;
    }
    useEffect(() => {
        function handleResize() {
            setWindowWidth(getWindowWidth());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resive', handleResize);
    }, []);

    if (!props.search) {
        // not searching: movie & tv credits are people
        if (type === 'movie' || type === 'tv') {
            type = 'person';
        } else {
            // not searching: multi or person credits are the corresponding media type
            type = p.media_type || type;
        }
    } else {
        // searching: multi is corresponding media type
        if (type === 'multi') {
            console.log(p.media_type);
            type = p.media_type;
        }
    }
    // otherwise we are searching and movie, tv, and people are what they are
    console.log(props.search);
    console.log(props.credits);

    return (
        <>
            <div
                className={`${windowWidth && windowWidth < 640 ? 'w-[100px]' : 'w-[200px]'}`}
            >
                <p className="font-bold text-xs sm:text-base tracking-wide line-clamp-2 text-wrap">
                    {p.name || p.title}
                </p>
                {props.search || !props.credits || (
                    <p className="text-sm line-clamp-1">
                        {`as ${
                            p.character ||
                            (p.roles && p.roles[0].character) ||
                            p.job
                        }`}
                    </p>
                )}
            </div>
            <div className="grid">
                <Link href={`/${type}/${p.id}`}>
                    {p.profile_path || p.poster_path ?
                        <Image
                            src={`https://image.tmdb.org/t/p/w200/${p.poster_path || p.profile_path}`}
                            alt={`${props.type === 'tv' ? p.name : p.title} image`}
                            width={
                                windowWidth && windowWidth < 640 ? '100' : '200'
                            }
                            height={
                                windowWidth && windowWidth < 640 ? '150' : '300'
                            }
                        />
                    :   <div
                            className={`${windowWidth && windowWidth < 640 ? 'w-[100px] h-[150px]' : 'w-[200px] h-[300px]'} bg-slate-900/80 text-slate-400 grid place-items-center text-center`}
                        >
                            no image available
                        </div>
                    }
                </Link>
            </div>
        </>
    );
}
