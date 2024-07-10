'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Card(props: {
    data: any;
    type?: string;
    search: boolean;
}) {
    const [windowWidth, setWindowWidth] = useState<number>();
    const p = props.data;
    let type = props.type;

    useEffect(() => {
        function getWindowWidth() {
            const width = window.innerWidth;
            return width;
        }

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
    } else if (type === 'multi') {
        // searching: multi is corresponding media type
        console.log(p.media_type);
        type = p.media_type;
    }
    // otherwise we are searching and movie, tv, and people are what they are

    return (
        <>
            <div className="max-w-[200px]">
                <p className="font-bold text-base tracking-wide line-clamp-2">
                    {p.name || p.title}
                </p>
                {!props.search && (
                    <p className="text-sm line-clamp-1">
                        {`as ${
                            p.character ||
                            (p.roles && p.roles[0].character) ||
                            p.job ||
                            'unknown'
                        }`}
                    </p>
                )}
            </div>
            <div className="grid min-w-36 self-end">
                <Link href={`/${type}/${p.id}`}>
                    {p.profile_path || p.poster_path ?
                        <Image
                            src={`https://image.tmdb.org/t/p/${windowWidth && windowWidth < 640 ? 'w300' : 'w200'}/${p.poster_path || p.profile_path}`}
                            alt={`${props.type === 'tv' ? p.name : p.title} image`}
                            width={
                                windowWidth && windowWidth < 640 ? '300' : '200'
                            }
                            height={
                                windowWidth && windowWidth < 640 ? '450' : '300'
                            }
                        />
                    :   <div
                            className={`${windowWidth && windowWidth < 640 ? 'w-[300px] h-[450px]' : 'w-[200px] h-[300px]'} bg-slate-900/80 text-slate-400 grid place-items-center`}
                        >
                            no image available
                        </div>
                    }
                </Link>
            </div>
        </>
    );
}
