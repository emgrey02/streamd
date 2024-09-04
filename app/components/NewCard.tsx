'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function NewCard(props: {
    data: any;
    type?: string;
    search: boolean;
    credits: boolean;
    fwr: boolean;
    seasons: boolean;
    seasonNum?: number;
    showId?: string;
}) {
    const p = props.data;
    let type = props.type;

    if (!props.search) {
        // not searching
        // movie & tv credits are people
        if (
            (type === 'movie' || type === 'tv') &&
            !props.fwr &&
            props.credits
        ) {
            type = 'person';
        } else if (props.fwr) {
            if (type === 'movies') type = 'movie';
        } else if (props.seasons) {
            type = 'tv';
        } else {
            // not searching: multi or person credits are the corresponding media type
            type = p.media_type || type;
        }
    } else {
        // searching: multi is corresponding media type
        if (type === 'multi') {
            type = p.media_type;
        }
    }
    // otherwise we are searching and movie, tv, and people are what they are

    return (
        <Link
            className="p-[5px] grid grid-cols-[100px_auto] h-[160px] gap-2 bg-slate-700 hover:bg-slate-700/40 hover:ring-2 hover:ring-brand-blue/20 transition overflow-hidden focus:outline-none focus:ring focus:ring-brand-blue"
            href={`/${type}/${props.showId ? props.showId : p.id}/${props.seasons ? `season/${props.seasonNum}/` : ''}`}
        >
            {p.profile_path || p.poster_path ?
                <Image
                    className="overflow-y-clip"
                    src={`https://image.tmdb.org/t/p/w200/${p.poster_path || p.profile_path}`}
                    alt={`${p.profile_path ? 'Profile of' : 'Poster for'} ${p.name || p.title}`}
                    width="100"
                    height="150"
                />
            :   <div className="w-[100px] h-[150px] bg-slate-900/80 text-slate-400 grid place-items-center text-center">
                    no image available
                </div>
            }
            <div className="flex flex-col gap-2 overflow-scroll">
                <p className="text-sm text-wrap mt-4 font-light w-fit">
                    {p.name || p.title}
                </p>
                {props.search || !props.credits || (
                    <>
                        {p.character ||
                            (p.roles && p.roles[0].character) ||
                            p.job ||
                            (p.jobs && p.jobs[0].job && (
                                <p className="text-sm text-wrap text-slate-300/80 w-fit">
                                    {`as ${
                                        p.character ||
                                        (p.roles && p.roles[0].character) ||
                                        p.job ||
                                        (p.jobs && p.jobs[0].job)
                                    }`}
                                </p>
                            ))}
                    </>
                )}
                {type == 'tv' && props.seasons && p.air_date && (
                    <>
                        <p></p>
                        <p className="text-sm font-light">
                            {p.air_date.slice(0, 4)}
                        </p>
                    </>
                )}

                {type == 'tv' && !props.seasons && p.first_air_date && (
                    <>
                        <p></p>
                        <p className="text-sm font-light">
                            {p.first_air_date.slice(0, 4)}
                        </p>
                    </>
                )}

                {type == 'movie' && (
                    <p className="text-sm font-light">
                        {p.release_date.slice(0, 4)}
                    </p>
                )}
            </div>
        </Link>
    );
}
